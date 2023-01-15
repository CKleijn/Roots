import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './token.schema';

@Injectable()
export class TokenService {
  // Inject all dependencies
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>
  ) {}

  // Get token by ID
  async getById(id: string): Promise<Token> {
    const token = await this.tokenModel.findOne({ _id: id });

    if (!token)
      throw new HttpException('Token bestaat niet!', HttpStatus.NOT_FOUND);

    return token;
  }

  // get user by ID from token
  async getByUserId(userId: string, type: string): Promise<Token> {
    const token = await this.tokenModel.findOne({ userId, type });

    if (!token)
      throw new HttpException('Token bestaat niet!', HttpStatus.NOT_FOUND);

    return token;
  }

  // Create new token
  async create(type: string, userId: string): Promise<Token> {
    const newToken: any = {
      type: type,
      expirationDate: new Date(Date.now() + 3600 * 1000 * 24),
      userId: userId,
    };

    type === 'verification'
      ? (newToken.verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ))
      : (newToken.verificationCode = '');

    return await this.tokenModel.create(newToken);
  }

  // Delete token
  async delete(userId: string, type: string) {
    return this.tokenModel.deleteMany({ userId, type });
  }
}
