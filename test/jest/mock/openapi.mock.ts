export class OpenapiMockedService {
  constructor() {}

  public async wordEmbedding(word: string) {
    return [0, 1, 0.5, 1, 0.6, 0.3];
  }
}
