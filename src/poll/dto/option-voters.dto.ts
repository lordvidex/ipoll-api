export class OptionVotersDto {
  id: string;
  title: string;
  votes: VoteUsersDto[];
  votesId: string[]
  pollId: string;
}

export class VoteUsersDto {
  id: string;
  name: string;
}
