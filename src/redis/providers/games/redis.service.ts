import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class GamesProvider {
	constructor(@InjectQueue('games') private gamesQueue: Queue) {}
	public setOnQueue(key: any, value: any) {
		 console.log('hello')
		 const customObject = {
		 	name: key,
		 	data: value
		 }
		  this.gamesQueue.add('process_data', customObject);
		//console.log(ejemplo)
	} 
}
