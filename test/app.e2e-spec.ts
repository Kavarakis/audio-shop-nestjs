import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../src/employee/dto/userLogin.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string = '';
  const data: object = {
    LastName: 'Salkic',
    FirstName: 'Semir',
    Email: 'semir-e2e@test.com',
    Password: 'Semir$',
  };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/signup (POST)', () => {
    return request(app.getHttpServer()).post('/signup').send(data).expect(201);
  });

  it('/signup (POST) | badPassword', (done) => {
    let badData = {
      LastName: 'Salkic',
      FirstName: 'Semir',
      Email: 'semir-e2e@test.com',
      Password: '$semir',
    };
    let expectedMessage =
      'Password must contain at least one upper case letter';
    request(app.getHttpServer())
      .post('/signup')
      .send(badData)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(JSON.stringify(res.body)).toContain(expectedMessage);
        done();
      });
  });
  it('/login (POST)', (done) => {
    request(app.getHttpServer())
      .post('/login')
      .send(data as UserLoginDto)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        let _res = res.body;
        token = _res.access_token;
        done();
      });
  });
  it('/login (POST) | non-existing user ', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({ Email: 'semir@semir.com', Password: '12S34$' } as UserLoginDto)
      .expect(401);
  });

  it('/tracks (GET)', () => {
    return request(app.getHttpServer())
      .get('/tracks')
      .set('Authorization', 'bearer ' + token)
      .expect(200);
  });

  it('/tracks (GET) - Unauthorized user', () => {
    const jwtService = new JwtService({
      secret: 'secret',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    });

    let badToken = jwtService.sign({
      username: 'bad@token.com',
      sub: 123018,
    });
    return request(app.getHttpServer())
      .get('/tracks')
      .set('Authorization', 'bearer ' + badToken)
      .expect(401);
  });
});
