import { describe, expect, it } from '@jest/globals'
import request from 'supertest'
import { app } from '../app'

describe('Test config', () => {
  it('returns 200 and has config', async () => {
    const res = await request(app).get('/api/config')

    expect(res.statusCode).toEqual(200)
    expect(res.body.config).not.toBeNull()
  })
})
