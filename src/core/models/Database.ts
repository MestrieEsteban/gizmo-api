import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'


export default class Database {
	private static _instance: Database | null = null

	private constructor() { }

	public static getInstance(): Database {
		if (!Database._instance) {
			Database._instance = new Database()
		}

		return Database._instance
	}

	public async authenticate() {
		dotenv.config()

		const founded = (process.env.DATABASE_URL as string).match(/^(postgres):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/)

		if (!founded) {
			throw new Error('[ERROR] Please check your DATABASE_URL value')
		}
	}
}
