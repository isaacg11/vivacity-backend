import request from 'supertest';
import app from './server';

describe('Applicant API', () => {
  it('should fetch applicants from /awesome/applicant', async () => {
    const response = await request(app).get('/awesome/applicant');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a new applicant', async () => {
    const newApplicant = {
      name: 'John Doe',
      picture: 'https://example.com/john-doe.jpg',
      bio: 'I am a software developer.',
    };

    const response = await request(app)
      .post('/awesome/applicant')
      .send(newApplicant);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newApplicant.name);
    expect(response.body.picture).toBe(newApplicant.picture);
    expect(response.body.bio).toBe(newApplicant.bio);
  });

  it('should update an existing applicant', async () => {
    const existingApplicant = {
      id: 1, // Assuming there is an existing applicant with ID 1
      name: 'John Doe',
      picture: 'https://example.com/john-doe.jpg',
      bio: 'I am a software developer.',
    };

    const updatedApplicant = {
      name: 'John Smith',
      picture: 'https://example.com/john-smith.jpg',
      bio: 'I am an experienced software engineer.',
    };

    const response = await request(app)
      .put(`/awesome/applicant/${existingApplicant.id}`)
      .send(updatedApplicant);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedApplicant.name);
    expect(response.body.picture).toBe(updatedApplicant.picture);
    expect(response.body.bio).toBe(updatedApplicant.bio);
  });

  it('should delete an existing applicant', async () => {
    const existingApplicant = {
      id: 1, // Assuming there is an existing applicant with ID 1
      name: 'John Smith',
      picture: 'https://example.com/john-smith.jpg',
      bio: 'I am an experienced software engineer.',
    };

    const response = await request(app).delete(`/awesome/applicant/${existingApplicant.id}`);

    expect(response.status).toBe(204);
  });
});
