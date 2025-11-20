import { NextRequest, NextResponse } from 'next/server';
import type { SandboxState } from '@/types/sandbox';
import { selectFilesForEdit, getFileContents, formatFilesForAI } from '@/lib/context-selector';
import { executeSearchPlan, formatSearchResultsForAI, selectTargetFile } from '@/lib/file-search-executor';
import { FileManifest } from '@/types/file-manifest';
import type { ConversationState, ConversationMessage, ConversationEdit } from '@/types/conversation';
import { appConfig } from '@/config/app.config';

// Force dynamic route to enable streaming
export const dynamic = 'force-dynamic';

declare global {
  var sandboxState: SandboxState;
  var conversationState: ConversationState | null;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'puter/gpt-5-nano', context, isEdit = false } = await request.json();
    
    console.log('[generate-ai-code-stream] Puter API - Received request');
    console.log('[generate-ai-code-stream] - prompt:', prompt);
    console.log('[generate-ai-code-stream] - isEdit:', isEdit);
    console.log('[generate-ai-code-stream] - context.sandboxId:', context?.sandboxId);

    // Prepare context for Puter API
    const fileContext = context?.currentFiles 
      ? `Current files:\n${Object.entries(context.currentFiles).map(([path, content]) => `\n${path}:\n${content}`).join('\n')}`
      : 'No files provided';

    const systemPrompt = isEdit
      ? `You are an expert web developer. Make targeted, precise edits to the provided code.\n\nContext:\n${fileContext}`
      : `You are an expert web developer creating new code.\n\nContext:\n${fileContext}`;

    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

    // Call Puter API via fetch
    const response = await fetch('https://puter.com/api/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: fullPrompt,
        model: 'gpt-5-nano',
      }),
    });

    if (!response.ok) {
      throw new Error(`Puter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.response || data.text || '';

    // Return streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send the response in chunks to simulate streaming
          const chunks = aiResponse.split(' ');
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(`0:"${chunk} "`));
            await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for streaming effect
          }
          controller.enqueue(encoder.encode('e:'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[generate-ai-code-stream] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
