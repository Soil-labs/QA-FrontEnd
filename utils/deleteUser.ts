import { APIRequestContext, expect } from '@playwright/test';

export const deleteUserAPI = async (request: APIRequestContext, memberId: string) => {
  const response = await request.post(`${process.env.GRAPHQL_ENDPOINT}`, {
    data: {
      query: `mutation {deleteMember(fields: {memberID: ${memberId} }) {_id discordName}}`,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  console.log(await response.json());
};
