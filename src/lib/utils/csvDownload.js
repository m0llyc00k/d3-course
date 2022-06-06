import { csvFormat } from 'd3';

export default (data) => {
	const content = `data:text/csv;charset=utf-8,${csvFormat(data)}`;
	return encodeURI(content);
};
