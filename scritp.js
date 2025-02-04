const fileUrl = '';

async function loadExcelData() {
    try {
        // Verifica se os dados já estão no sessionStorage
        const savedData = sessionStorage.getItem('excelData');
        if (savedData) {
            console.log('Dados carregados do sessionStorage.');
            return JSON.parse(savedData); // Retorna os dados salvos no formato JSON
        }

        // Faz o fetch dos dados do arquivo CSV
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(Erro ao baixar a planilha: ${response.statusText});
        }

        const csvData = await response.text();

        // Converte o CSV em linhas e células
        const rows = csvData
            .split('\n')
            .filter(row => row.trim() !== '') // Remove linhas vazias
            .map(row => {
                return row.split(/,(?=(?:(?:[^"]"){2})[^"]*$)/)
                    .map(cell => cell.replace(/^"|"$/g, '').trim()); // Remove aspas e espaços desnecessários
            });

        if (rows.length === 0) {
            throw new Error('O CSV está vazio ou os dados não foram carregados corretamente.');
        }

        // Extrai os cabeçalhos (primeira linha)
        const headers = rows.shift();

        // Transforma as linhas em objetos JSON usando os cabeçalhos
        const jsonData = rows.map(row => {
            const item = {};
            headers.forEach((header, index) => {
                item[header] = row[index] || ''; // Garante que valores ausentes sejam representados por string vazia
            });
            return item;
        });

        // Salva no sessionStorage
        sessionStorage.setItem('excelData', JSON.stringify(jsonData));
        console.log('Dados salvos no sessionStorage.');

        return jsonData;
    } catch (error) {
        console.error(Erro ao carregar os dados: ${error.message});
        alert('Erro ao carregar os dados da planilha.');
        return [];
    }
}

// Chamada da função e exibição dos dados no console
loadExcelData()
    .then(jsonData => {
        console.log('Dados JSON:', jsonData);
    })
    .catch(error => {
        console.error('Erro durante a execução:', error);
    });

console.log("Carregando os dados...");
