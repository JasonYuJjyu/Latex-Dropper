const { jsPDF } = window.jspdf;
var pdf_data_string = null;
var filename = '';


function convert(){
	// convert tex to raw svg
	tex_string = document.getElementById('tex_input').value;
	latex_svg = MathJax.tex2svg(tex_string);
	extracted_svg = latex_svg.getElementsByTagName('svg')[0].outerHTML

	// inject svg into div
	document.getElementById('svg_ouput').innerHTML = extracted_svg;

	// get dimensions of svg
	let svgElement = document.getElementById('svg_ouput').firstElementChild;
  svgElement.getBoundingClientRect() // force layout calculation
  let width = svgElement.width.baseVal.value;
  let height = svgElement.height.baseVal.value;

	// create pdf (borrowed code from svg2pdf.js)
	const pdf = new jsPDF(width > height ? 'l' : 'p', 'pt', [width, height]);
	pdf.svg(svgElement, { width, height }).then(function(){
		// save raw pdf file data as url string
		pdf_data_string = pdf.output('dataurlstring');
		filename = 'latex';
	});
}

function page_startup(startup_event){
	let element = document.getElementById('svg_ouput');
	element.addEventListener('dragstart',function(e){
		if(pdf_data_string){ // if pdf data exists, inject file for drag and drop
			e.dataTransfer.setData("DownloadURL",`application/pdf:${filename}.pdf:${pdf_data_string}`)
		}
	});
}
document.addEventListener("DOMContentLoaded", page_startup);
