import { promises as fs } from 'fs';
import path from 'path';
import type { Vote, VoteCounts } from '@/types/vote';
import { hashString } from '@/lib/utils';

const VOTES_FILE = path.join(process.cwd(), 'src', 'data', 'votes.json');

async function readVotes(): Promise<Vote[]> {
  try {
    const raw = await fs.readFile(VOTES_FILE, 'utf-8');
    return JSON.parse(raw) as Vote[];
  } catch {
    return [];
  }
}

async function writeVotes(votes: Vote[]): Promise<void> {
  await fs.writeFile(VOTES_FILE, JSON.stringify(votes, null, 2), 'utf-8');
}

export async function hasVotedInCategory(email: string, categoryId: string): Promise<boolean> {
  const votes = await readVotes();
  const emailHash = hashString(email.toLowerCase().trim());
  return votes.some((v) => v.emailHash === emailHash && v.categoryId === categoryId);
}

export async function getLastVoteAttempt(email: string, ip: string): Promise<Vote | null> {
  const votes = await readVotes();
  const emailHash = hashString(email.toLowerCase().trim());
  const ipHash = hashString(ip);
  const recent = votes
    .filter((v) => v.emailHash === emailHash || v.ipHash === ipHash)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return recent[0] ?? null;
}

export async function recordVote(params: {
  email: string;
  categoryId: string;
  nomineeId: string;
  ip: string;
}): Promise<Vote> {
  const votes = await readVotes();
  const vote: Vote = {
    id: `vote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email: params.email.toLowerCase().trim(),
    emailHash: hashString(params.email.toLowerCase().trim()),
    categoryId: params.categoryId,
    nomineeId: params.nomineeId,
    ipHash: hashString(params.ip),
    timestamp: new Date().toISOString(),
  };
  votes.push(vote);
  await writeVotes(votes);
  return vote;
}

export async function getVoteCounts(): Promise<VoteCounts> {
  const votes = await readVotes();
  const counts: VoteCounts = {};
  for (const v of votes) {
    counts[v.nomineeId] = (counts[v.nomineeId] ?? 0) + 1;
  }
  return counts;
}
