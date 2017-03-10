NodeList.prototype.forEach = Array.prototype.forEach; 
HTMLCollection.prototype.forEach = Array.prototype.forEach;

const WEBSERVICE = 'http://mhcws.herokuapp.com/ws';

/****************************** OVERRIDE ******************************/
/** @auth Matheus Castiglioni
 *  Adicionando a função equals para comparar Strings de forma mais fácil
 */
Object.prototype.equals = function(string) {
	let s = '';
	for (let i = 0; i < this.length; i++) {
		s = s.concat(this[i]);
	}
	return s === string;
}

/** @auth Matheus Castiglioni
 *  Adicionando a find para buscar elementos filhos de uma forma mais fácil
 */
Object.prototype.find = function(selector) {
	return this.querySelector(selector);
}
Object.prototype.findAll = function(selector) {
	return this.querySelectorAll(selector);
}

/****************************** BASE ******************************/
/** @auth Matheus Castiglioni
 * Criando um atalho para buscar elementos na página com javascript puro 
 */
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

/** @auth Matheus Castiglioni
 *  Retirando espaços de uma string 
 */
const trimAll = s => s.replace(/([\\s]+)/g, ""); // Todos os espaços
const trimLeft = s => s.replace(/^([\\s]+)/, ""); // Espaços á esquerda
const trimRight = s => s.replace(/([\\s]+)$/, ""); // Espaços a direita
const trimLeftRight = s => s.replace(/(^([\\s]*)|([\\s]+)$)/g, ""); // Espaços a direita e esquerda

/** @auth Matheus Castiglioni
 *  Inserir elementos no body 
 */
const append = element => document.body.appendChild(element);

/** @auth Matheus Castiglioni
 *  Disparando evento change manualmente em um determinado elemento
 */
const invokeChange = element => element.dispatchEvent(new Event('change'));

/** @auth Matheus Castiglioni
 *  Mostrar elemento
 */
function showElement(element) {
	element.classList.remove('is-hide');
	element.classList.add('is-show');
}

/** @auth Matheus Castiglioni
 *  Esconder elemento
 */
function hideElement(element) {
	element.classList.remove('is-show');
	element.classList.add('is-hide');
}

/****************************** FUNCTION ******************************/
document.addEventListener('DOMContentLoaded', function(event) {
	
	/** @auth Matheus Castiglioni
	 *  Esconder qualquer elemento que tenha a classe js-timeOut após 2 segundos
	 */
	setTimeout(function() {
		let timeout = $('.js-timeOut');
		if (timeout != undefined)
			timeout.style.display = 'none';
	}, 2000);
	
	/** @auth Matheus Castiglioni
	 *  Ao realizar double click em uma table irá procurar se possui algum input ou textarea que esta precisando
	 *  receber algum informação referente a linha clicada, caso existe o valor é jogado para eles e o modal é fechado
	 */
	let trs = $$('table.js-slTable > tbody > tr');
	if (trs.length > 0) {
		trs.forEach(tr => {
			tr.addEventListener('dblclick', function(e) {
				let search = $('[data-search]');
				let select = e.target.parentNode.find('[data-select]');
				select.options.forEach(option => {
					let element = !search.value.equals('') ? parent.document.find(`[data-target*='${option.dataset.provide}'][data-search='${search.value}']`) : parent.document.find(`[data-target*='${option.dataset.provide}']`);
					if (element) {
						element.value = option.value;
						invokeChange(element);
					}
				});
				closeModal();
			});
		});
	}
	
	/** @auth Matheus Castiglioni
	 *  Amarrando dois elementos como um só, caso algum deles esteja valido o outro é validado também
	 */
	const dependencys = $$('[data-dependency]');
	if (dependencys.length > 0) {
		dependencys.forEach(dependency => {
			checkValidateDependency(dependency);
			dependency.addEventListener('input', function() {
				checkValidateDependency(this);
			});
		});
	}
	
});

/** @auth Matheus Castiglioni
 *  Função para chekcar se o input esta válido ou não para poder inválidar ou validar sua dependência
 */
function checkValidateDependency(element) {
	if (element.checkValidity())
		elementRemoveAttribute(`#${element.dataset.dependency}`, 'required');
	else
		elementAddAttribute(`#${element.dataset.dependency}`, 'required', 'true');
}

/** @auth Matheus Castiglioni
 *  Função para gerar um código de acordo a data atual e informar no input
 */
function createCode(button) {
	let input = button.parentNode.parentNode.find('input');
	var data = new Date();
	var code = `${data.getDate()}${(data.getMonth() + 1)}${data.getFullYear().toString().substring(2)}${data.getHours()}${data.getMinutes()}${data.getSeconds()}${data.getMilliseconds()}`;
	if (input)
		input.value = code;
}

/** @auth Matheus Castiglioni
 *  Função para pegar a data atual e informar no input
 */
function insertDate(button) {
	let input = button.parentNode.parentNode.find('input');
	let agora = new Date();
	let dia = agora.getDate();
	let mes = agora.getMonth() + 1;
	let hora = agora.getHours();
	let minuto = agora.getMinutes();
	dia = dia < 10 ? `0${dia}` : dia;
	mes = mes < 10 ? `0${mes}` : mes;
	hora = hora >= 1 && hora <= 9 ? `0${hora}` : hora;
	minuto = minuto >= 0 && minuto <= 9 ? `0${minuto}` : minuto;
	if (!input.readOnly && input)
		input.value = `${dia}/${mes}/${agora.getFullYear()} ${hora}:${minuto}`;
}

/** @auth Matheus
 *  Botão para deletar itens via Ajax utilizando @Delete
 */
function requestDelete(obj) {
	const URL = obj.href || obj.formAction;
	const ID = URL.substring(URL.lastIndexOf('=') + 1);
	if (confirm("Deseja confirmar a exlusao ?")) {
		HttpService.request(URL, 'DELETE').then(response => {
			if (obj.parentNode.classList.contains('has-Father')) {
				let children = obj.parentNode.parentNode.parentNode.findAll(`.js-Father${ID}`);
				if (children.length > 0)
					children.forEach(child => child.parentNode.remove());
			}
			obj.parentNode.parentNode.remove();
			append(toastDelete('o-toast--success', 'Registro excluido com sucesso', 'icon-ok-circled'));
		}).catch(error => {
			append(toastDelete('o-toast--error', 'Registro nao pode ser excluido', 'icon-cancel-circled'));
			console.error(error);
		});
	}
};	

/** @auth Mahteus Castiglioni
 *  Função para fechar os modais após alguma execução de script
 */
function closeModal() {
	let modal = parent.document.find('.js-o-modal');
	let background = parent.document.find('.js-o-modal__background');
	if (modal && background) {
		modal.remove()
		background.remove();
	}
}

/** @auth Matheus Castiglioni
 *  Cria um toast para quando a exclusão via ajax é realizada com sucesso 
 */
function toastDelete(type, message, icon) {
	let toast = document.createElement('DIV')
	toast.setAttribute('role', 'alert');
	toast.classList.add(type, 'has-icon', 'is-fixedTop', 'js-timeOut');
	toast.innerHTML = `<p class="o-toast__message">${message}<i class="${icon} o-toast__icon--left"></i></p>`;
	if (type.equals('o-toast--error'))
		toast.innerHTML += '<button class="o-toast__close" onclick="ToastController.close(this.parentNode);"><i class="icon-cancel"></i></button>';
	if (type.equals('o-toast--success')) {
		setTimeout(function() {
			toast.style.display = 'none';
		}, 2000);
	}
	return toast;
}

/** @auth Matheus Castiglioni
 *  Função genérica para realizar uma requisição via AJAX 
 */
function request(obj, event) {
	event.preventDefault();
	const URL = obj.href || obj.formAction || obj.action;
	return new Promise((resolve, reject) => {
		HttpService.request(URL, obj.method, obj.elements, true).then(response => {
			resolve(response);
		}).catch(error => reject(error));	
	});
}

/** @auth Matheus Castiglioni
 *  Realizar uma requisição Pvia AJAX para o servidor e se tudo der certo fechar o modal, caso o formulário
 *  possua um loadgrid na tela PAI o mesmo é carregado sem fazer reload na página toda. 
 */
function requestModal(obj, event) {
	request(obj, event).then(function() {
		const loadGrid = parent.document.find(`.js-loadgrid[id^=${obj.id.substring(4)}]`);
		if (loadGrid) {
			LoadGrid.load(loadGrid.dataset.load).then(response => {
				loadGrid.innerHTML = '';
				loadGrid.append(response);
			}).catch(error => console.error(error));
		} else {
			parent.document.location = parent.document.location;
		}
		closeModal();
	}).catch(error => console.error(error));
}

/** @auth Matheus Castiglioni
 *  Busca um determinado elemento e remove um determinado atributo 
 */
function elementRemoveAttribute(selector, attribute) {
	let element = $(selector);
	if (element)
		element.removeAttribute(attribute);
}

/** @auth Matheus Castiglioni
 *  Busca um determinado elemento e adiciona um determinado atributo 
 */
function elementAddAttribute(selector, attribute, value) {
	let element = $(selector);
	if (element)
		element.setAttribute(attribute, value);
}

/** @auth Matheus Castiglioni
 *  Função para limpar os valores dos inputs que são alimentados via ListaSL
 */
function clearSL(obj) {
	let input = obj.parentNode.parentNode.find('input');
	let inputsLimpar = document.findAll(`[data-search=${input.dataset.search}]`);
	inputsLimpar.forEach(input => {
		input.value = '';
	});
}

/****************************** CLASSES ******************************/
const CODE_DONE = 4;
const CODE_OK = 200;

/** @auth Matheus Castiglioni
 *  Classe responsável por realizar requisições ajax para uma determinada url
 */
class HttpService {

	static request(url, verb, params, buildParams) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(verb, url, true);
			if (verb.equals('POST'))
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.onreadystatechange = function() {
				if (xhr.readyState == CODE_DONE) {
					if (xhr.status == CODE_OK)
						resolve(xhr.responseText);
					else
						reject(xhr.responseText);
				}
			}
			xhr.ontimeout = function() {
				console.error('A requisição excedeu o tempo limite');
			}
			xhr.send(this.populateParams(params, buildParams));
		});
	}
	
	static populateParams(params, buildParams) {
		// Verificando se ja esta sendo passado os dados para requisição via POST
		if (!buildParams)
			return params;
		
		if (params && params.length > 0) {
			let data = new FormData();
			params.forEach(param => {
				if (!param.name.endsWith('aux') && this.isData(param))
					data.append(param.name, param.value);
			});
			return data;
		}
		
		return null;
	}
	
	static isData(element) {
		return element.nodeName.toLowerCase().equals('input') || element.nodeName.toLowerCase().equals('select') || element.nodeName.toLowerCase().equals('textarea');
	}
	
}