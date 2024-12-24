import { MockChatHttpService } from './mock_http_service';
import { CreateChatParams, UpdateChatParams } from '@/types/ai';
import { ErrorCode } from '@/types/error';
import { beforeEach, describe, expect, test } from '@jest/globals';
describe('MockChatHttpService - Chat Management', () => {
  let chatService: MockChatHttpService;

  beforeEach(() => {
    chatService = new MockChatHttpService();
  });

  describe('createChat', () => {
    test('should create a new chat successfully', async () => {
      const params: CreateChatParams = {
        chat_id: 'chat1',
        name: 'New Chat',
        rag_ids: [],
      };
      const response = await chatService.createChat('workspace1', params);
      expect(response.isSuccess()).toBe(true);

      // Verify that chat was created in the service's chat map
      const chatSettingsResponse = await chatService.getChatSettings(
        'workspace1',
        'chat1'
      );
      expect(chatSettingsResponse.isSuccess()).toBe(true);
      expect(chatSettingsResponse.data?.name).toBe('New Chat');
    });

    test('should fail to create a chat if chat_id is missing', async () => {
      const params: CreateChatParams = {
        chat_id: '',
        name: 'Invalid Chat',
        rag_ids: [],
      };
      const response = await chatService.createChat('workspace1', params);
      expect(response.isSuccess()).toBe(false);
      expect(response.error?.code).toBe(ErrorCode.InvalidRequest);
    });
  });

  describe('deleteChat', () => {
    test('should delete an existing chat successfully', async () => {
      const createParams: CreateChatParams = {
        chat_id: 'chat1',
        name: 'Chat to Delete',
        rag_ids: [],
      };
      await chatService.createChat('workspace1', createParams);

      const deleteResponse = await chatService.deleteChat(
        'workspace1',
        'chat1'
      );
      expect(deleteResponse.isSuccess()).toBe(true);

      // Verify that the chat has been deleted
      const getSettingsResponse = await chatService.getChatSettings(
        'workspace1',
        'chat1'
      );
      expect(getSettingsResponse.isSuccess()).toBe(false);
      expect(getSettingsResponse.error?.code).toBe(ErrorCode.RecordNotFound);
    });

    test('should return error when deleting a non-existent chat', async () => {
      const deleteResponse = await chatService.deleteChat(
        'workspace1',
        'non_existing_chat'
      );
      expect(deleteResponse.isSuccess()).toBe(false);
      expect(deleteResponse.error?.code).toBe(ErrorCode.RecordNotFound);
    });
  });

  describe('updateChatSettings', () => {
    test('should update the chat settings successfully', async () => {
      const createParams: CreateChatParams = {
        chat_id: 'chat1',
        name: 'Old Chat',
        rag_ids: [],
      };
      await chatService.createChat('workspace1', createParams);

      const updateParams: UpdateChatParams = {
        name: 'Updated Chat',
        rag_ids: ['rag1'],
        metadata: { key: 'value' },
      };
      const updateResponse = await chatService.updateChatSettings(
        'workspace1',
        'chat1',
        updateParams
      );
      expect(updateResponse.isSuccess()).toBe(true);

      const getSettingsResponse = await chatService.getChatSettings(
        'workspace1',
        'chat1'
      );
      expect(getSettingsResponse.isSuccess()).toBe(true);
      expect(getSettingsResponse.data?.name).toBe('Updated Chat');
      expect(getSettingsResponse.data?.rag_ids).toEqual(['rag1']);
    });

    test('should fail to update settings for a non-existing chat', async () => {
      const updateParams: UpdateChatParams = {
        name: 'Updated Chat',
        rag_ids: ['rag1'],
        metadata: { key: 'value' },
      };
      const updateResponse = await chatService.updateChatSettings(
        'workspace1',
        'non_existing_chat',
        updateParams
      );
      expect(updateResponse.isSuccess()).toBe(false);
      expect(updateResponse.error?.code).toBe(ErrorCode.RecordNotFound);
    });

    test('should fail to update chat settings with invalid data', async () => {
      const createParams: CreateChatParams = {
        chat_id: 'chat1',
        name: 'Old Chat',
        rag_ids: [],
      };
      await chatService.createChat('workspace1', createParams);

      const updateParams: UpdateChatParams = {
        name: null,
        rag_ids: null,
        metadata: null,
      }; // Invalid update
      const updateResponse = await chatService.updateChatSettings(
        'workspace1',
        'chat1',
        updateParams
      );
      expect(updateResponse.isSuccess()).toBe(false);
      expect(updateResponse.error?.code).toBe(ErrorCode.InvalidRequest);
    });
  });

  describe('getChatSettings', () => {
    test('should retrieve the chat settings successfully', async () => {
      const createParams: CreateChatParams = {
        chat_id: 'chat1',
        name: 'New Chat',
        rag_ids: [],
      };
      await chatService.createChat('workspace1', createParams);

      const getSettingsResponse = await chatService.getChatSettings(
        'workspace1',
        'chat1'
      );
      expect(getSettingsResponse.isSuccess()).toBe(true);
      expect(getSettingsResponse.data?.name).toBe('New Chat');
    });

    test('should return error if chat does not exist', async () => {
      const getSettingsResponse = await chatService.getChatSettings(
        'workspace1',
        'non_existing_chat'
      );
      expect(getSettingsResponse.isSuccess()).toBe(false);
      expect(getSettingsResponse.error?.code).toBe(ErrorCode.RecordNotFound);
    });
  });
});
