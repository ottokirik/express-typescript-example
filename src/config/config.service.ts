import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger';
import { TYPES } from '../types';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private _config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private readonly logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error(`[ConfigService] Не удалось загрузить конфигурацию`);
		} else {
			this.logger.log('[ConfigService] Конфигурация загружена');
			this._config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this._config[key];
	}
}
