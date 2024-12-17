export class GameUserSuccessSkipRequestDto {
  constructor(
    readonly gameId: string,
    readonly index: number,
  ) {}
}
