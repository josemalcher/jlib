NodeList.prototype.forEach = Array.prototype.forEach; 
HTMLCollection.prototype.forEach = Array.prototype.forEach;

var pathRaiz = '/puppis';
if (location.host.startsWith('painel'))
	pathRaiz = '';

/****************************** FUNCTION ******************************/
document.addEventListener('DOMContentLoaded',function (event) {
	
	setTimeout(function() {
		let timeout = $('.js-timeOut');
		if (timeout != undefined)
			time.style.display = 'none';
	}, 2000);
	
});

// LIMPA TODOS OS ESPACOS DE UMA STRING
function trimAll(string) {
	return string.replace(/\s/g, "");
}

// LIMPA ESPACOS A ESQUERDA
function trimLeft(string) {
	return string.replace(/^\s+/, "");
}

// LIMPA ESPACOS A DIREITA
function trimRight(string) {
	return string.replace(/\s+$/, "");
}

// LIMPA ESPACOS A DIREITA E ESQUERDA
function trimLeftRight(string) {
	return string.replace(/^\s+|\s+$/g, "");
}

function gerarCode() {
	var data = new Date();
	var code = `${data.getDate()}${(data.getMonth() + 1)}${data.getFullYear().toString().substring(2)}${data.getHours()}${data.getMinutes()}${data.getSeconds()}${data.getMilliseconds()}`;
	$('.js-codeTarget').value = code;
}

/****************************** BASE ******************************/
/** @auth Matheus Castiglioni
 * Criando um atalho para buscar elementos na página com javascript puro 
 */
function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

/****************************** OVERRIDE ******************************/
/** @auth Matheus Castiglioni
 *  Adicionando a função equals para comparar Strings de forma mais fácil
 */
Object.prototype.equals = function(string) {
	let s = '';
	for (let i = 0; i < this.length; i++) {
		s = s.concat(this[i]);
	}
	return s == string;
}

/****************************** CLASSES ******************************/
class HttpService {

	static get(url) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', url);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(JSON.parse(xhr.responseText));
					} else {
						console.log(xhr.responseText);
						reject(xhr.responseText);
					}
				}
			}
			xhr.send();
		});
	}

}