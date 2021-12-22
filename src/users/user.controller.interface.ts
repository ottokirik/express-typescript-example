import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common';

export interface IUserController {
	signin: (req: Request, res: Response, next: NextFunction) => void;
	signup: (req: Request, res: Response, next: NextFunction) => void;
	info: (req: Request, res: Response, next: NextFunction) => void;
}
