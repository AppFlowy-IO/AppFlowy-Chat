export const SupportedAttachmentExtensionNames = [
  'pdf',
  'png',
  'jpg',
  'jpeg',
] as const;

export const SupportedAttachmentExtensions =
  SupportedAttachmentExtensionNames.map((item) => '.' + item).join(', ');
