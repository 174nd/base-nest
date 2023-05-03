
export declare type randomizeOptions = {
  length: number;
  type?: 'number' | 'char-upper' | 'char-lower';
};

export function randomize(options: number | randomizeOptions): string {
  let chars = '', length = 0;
  if(typeof options == 'number'){
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; length = options;
  }else{
    length = options.length;
    switch(options.type){
      case 'number':
        chars = '0123456789';
        break;
      case 'char-upper':
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'char-lower':
        chars = 'abcdefghijklmnopqrstuvwxyz';
        break;
      default:
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        break;
    }
  }

  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}