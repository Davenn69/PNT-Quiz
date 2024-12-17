export interface UserRankResponseDTO {
  id: string;
  username: string;
  mmr: number;
  rank: number;
  profilePicture: string | null;
  type: string
}
