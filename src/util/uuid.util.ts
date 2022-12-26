import { customAlphabet } from 'nanoid';

export class UUIDGenerator {
  private static nanoid = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    10,
  );
  static random() {
    return this.nanoid();
  }
}
