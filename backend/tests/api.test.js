import request from 'supertest';
import app from '../app.js';

describe('Root API', () => {
    it('should return API status', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('ERP API is running...');
    });
});
