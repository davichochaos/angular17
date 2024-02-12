import { CommonModule } from '@angular/common';
import { Component, signal, computed, effect, inject, Injector } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from '../../models/task.model';
import { HtmlParser } from '@angular/compiler';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {
	lists = signal<Task[]>([
		/*
		{
			id: Date.now(),
			title: 'crear proyecto',
			completed: false,
		},
		{
			id: Date.now(),
			title: 'crear componentes',
			completed: false,
		},*/
	]);

	filter = signal<'all' | 'pending' | 'completed'>('all');
	tasksByFilter = computed(() => {
		const filter = this.filter();
		const tasks = this.lists();
		if (filter === 'pending') {
			return tasks.filter(task => !task.completed);
		}
		if (filter === 'completed') {
			return tasks.filter(task => task.completed);
		}
		return tasks;
	})

	newTaskCtrl = new FormControl('',  {
		nonNullable: true,
		validators: [
			Validators.required,
		]
	});

	injector = inject(Injector);

	ngOnInit() {
		const storage = localStorage.getItem('tasks');
		if (storage) {
			const tasks = JSON.parse(storage);
			this.lists.set(tasks);
		}
		this.trackTasks();
	}

	trackTasks() {
		effect(() => {
			const tasks = this.lists();
			console.log(tasks);
			localStorage.setItem('tasks', JSON.stringify(tasks));
		}, { injector: this.injector});
	}

	changeHandler(){
		/*const input = event.target as HTMLInputElement;
		const newtask = input.value;*/
		if(this,this.newTaskCtrl.valid){
			const value = this.newTaskCtrl.value.trim();
			if(value !== ''){
				this.addTask(value);
				this.newTaskCtrl.setValue('');
			}
		}
	}

	addTask(title: string){
		const newtask = {
			id: Date.now(),
			title,
			completed: false,
		}
		this.lists.update((lists) => [...lists, newtask]);

	}

	deleteTask(index: number){
		this.lists.update((lists) => lists.filter((item, position) => position !== index));
	}

	updateTask(index: number){
		this.lists.update((lists) => {
			return lists.map((item, position) => {
				if(position === index){
					return {
						...item,
						completed: !item.completed	
					}
				}
				return item;
			})
		}); 
	}

	updateTaskEditing(index: number){
		this.lists.update((lists) => {
			return lists.map((item, position) => {
				if(position === index){
					return {
						...item,
						editing: true	
					}
				}
				return {
					...item,
					editing: false
				};
			})
		}); 
	}

	updateTaskText(index: number, event: Event){
		const input = event.target as HTMLInputElement;
		this.lists.update((lists) => {
			return lists.map((item, position) => {
				if(position === index){
					return {
						...item,
						//editing: true	
						title: input.value,
						editing: false	
					}
				}
				return item;
				/*return {
					...item,
					editing: false
				};*/
			})
		}); 
	}

	changeFilter(filter: 'all' | 'pending' | 'completed'){
		this.filter.set(filter);
	}
}
