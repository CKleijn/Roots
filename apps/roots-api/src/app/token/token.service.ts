import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>
  ) {}

  async getById(_id: string): Promise<Token> {
    console.log('getById');
    const token = await this.tokenModel.findOne({ _id });

    if (!token)
      throw new HttpException('Token bestaat niet!', HttpStatus.NOT_FOUND);

    return token;
  }

  async create(type: string, userId: string): Promise<Token> {
    console.log('create');

    const newToken = {
      type: type,
      expirationDate: new Date(Date.now() + 3600 * 1000 * 24),
      userId: userId,
    };

    return await this.tokenModel.create({ newToken });
  }

  async delete(userId: string) {
    return this.tokenModel.deleteMany({ userId });
  }
}
