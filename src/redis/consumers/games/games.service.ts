import {  OnQueueCompleted, OnQueueError, OnQueueFailed, OnQueueWaiting, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';
//import { FirestoreService } from 'src/firestore/repos/firestore/firestore.service';

@Processor('games')
export class GamesConsumer {
	constructor(@Inject('FIRESTORE_SERVICE') private client: ClientProxy) {}
	@Process('process_data')
	async process(job: Job) {
		const arg = job.data
		firstValueFrom(this.client.send({ cmd: 'insert_on_firestore' }, { value: arg.data, key: arg.name })).then(() => job.isCompleted()).catch(e => console.log(e))	
	}

	@OnQueueWaiting()
	ejemplo(job: Job) {
		console.log("Current number job, revisando que todo este bien", job)
	}


	//Devuelve una promesa para cuando se borre de la lista
	@OnQueueCompleted() 
	completado(job: Job) {
		job.remove();
		job.discard()
	}


	@OnQueueError() 
	error(job: Job) {
		console.log('There is a error', job.isFailed)
	}
	

	@OnQueueFailed()
	failed(job: Job) {
		console.log('It is failed:', job.isFailed)
	}
}
