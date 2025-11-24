// @ts-ignore
import numeral from 'numeral'
const yuan = (val: number | string) => `¥ ${numeral(val).format('0,0')}`

export default yuan
