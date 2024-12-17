export class GameResponseDto {
  constructor(
    readonly secureId: string,
    readonly question: string,
    readonly gameParticipants: {
      readonly userId: string;
      readonly username: string;
      readonly successes: number[];
      readonly skips: number[];
    }[],
    readonly expired: string,
  ) {}
}
