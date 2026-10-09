import { strict as assert } from 'node:assert';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../pages/api/quote';
import { sanitiseAnalyticsUrl } from '../lib/analytics-sanitise';
const cases: string[]=[];
async function rejection(name:string,headers:Record<string,string>,expected:number){
  let code=0;const res={setHeader(){},status(n:number){code=n;return this;},json(){return this;}} as unknown as NextApiResponse;
  const req={method:'POST',headers,body:{},socket:{remoteAddress:'127.0.0.5'}} as unknown as NextApiRequest;
  await handler(req,res);assert.equal(code,expected,name);cases.push(name);
}
async function main(){
await rejection('cross-site fetch is rejected even without Origin',{'content-type':'application/json','sec-fetch-site':'cross-site'},403);
await rejection('request Host cannot authorise a foreign Origin',{'content-type':'application/json',origin:'https://attacker.example',host:'attacker.example'},403);
await rejection('non-JSON payload is rejected before validation',{'content-type':'text/plain'},415);
assert.equal(sanitiseAnalyticsUrl('https://apexweb.au/quote?email=private@example.test#private'), 'https://apexweb.au/quote');cases.push('analytics drops query strings and fragments');
console.log(JSON.stringify({passed:cases.length,cases},null,2));

}
main().catch(error=>{console.error(error);process.exitCode=1;});
