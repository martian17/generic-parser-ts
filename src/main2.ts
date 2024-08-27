class parserState {
    constructor(public input: string, public i: number){}
    clone(){
        return new parserState(this.input, this.i);
    }
    slice(){
        return this.input.slice(this.i);
    }
    skipSpaces(){
        const DOUBLE = 0;
        const DOUBLE_END = 1;
        const SINGLE = 2;
        const SPACE = 3;
        const SPACE_SLASH = 4;
        let state = SPACE;
        let i = this.i;
        for(; i < this.input.length; i++){
            if(state === DOUBLE){
                if(this.input[i] === "*")state = DOUBLE_END;
            }else if(state === DOUBLE_END){
                if(this.input[i] === "/")state = SPACE;
            }else if(state === SINGLE){
                if(this.input[i] === "\n")state = SPACE;
            }else if(state === SPACE){
                if(this.input[i] === "/")state = SPACE_SLASH;
                if(!this.input[i].match(/\s/))break;
            }else if(state === SPACE_SLASH){
                if(this.input[i] === "/")state = SINGLE;
                if(this.input[i] === "*")state = DOUBLE;
                if(!this.input[i].match(/\s/))break;
            }
        }
        this.i = i;
        return this;
    }
    apply(state: parserState){
        this.input = state.input;
        this.i = state.i;
    }
}

type parserResult = {
    start: number;
    end: number;
    input: string;
};

type stringResult = parserResult & {
    match: string;
}

//type matcher = string | RegExp | (<T extends parserResult>(state: parserState)=>T);
type matcher = string | RegExp | ((state: parserState)=>parserResult | undefined);
type matcherResultType<m extends matcher> = m extends ((...args: any) => any) ? ReturnType<m> : stringResult;
//m extends string ? stringResult : m extends RegExp ? stringResult : ReturnType<m>
type normalizeMatcher<m extends matcher> = m extends ((...args: any) => any) ? m : ((state: parserState) => stringResult | undefined);

function toMatchBeginningRegex(regex: RegExp): RegExp{
    return regex.source.startsWith('^')
        ? regex
        : new RegExp('^' + regex.source, regex.flags);
}

function toMatcher<m extends matcher>(matcher: m): /*normalizeMatcher<m>*/((state: parserState) => matcherResultType<m> | undefined){
    if(typeof matcher === "string"){
        //@ts-ignore
        return ((state: parserState)=>{
            const str = state.slice();
            if(str.startsWith(matcher)){
                return {
                    start: state.i,
                    end: state.i + matcher.length,
                    input: state.input,
                    match: matcher,
                }
            }
        });
    }else if(matcher instanceof RegExp){
        const matcherRegex = toMatchBeginningRegex(matcher);
        //@ts-ignore
        return ((state: parserState)=>{
            const str = state.slice();
            let match: RegExpMatchArray | null;
            if(match = str.match(matcherRegex)){
                return {
                    start: state.i,
                    end: state.i + match[0].length,
                    input: state.input,
                    match: match[0],
                }
            }
        });
    }else{
        //@ts-ignore
        return matcher;
    }
}

interface AAA extends parserResult{
    test1: string;
}

function test(state: parserState): /*({test1: string} & parserResult)*/ AAA {
    return {
        start: state.i,
        end: state.i + 2,
        input: state.input,
        test1: "asdfasd"
    }
}

const a = toMatcher("test");

type u = undefined

function parseListLike<head_m extends matcher, body_m extends matcher, separator_m extends matcher, tail_m extends matcher>
(head0: head_m, body0: body_m, separator0: separator_m, tail0: tail_m){
    const p_head = toMatcher(head0);
    const p_body = toMatcher(body0);
    const p_separator = toMatcher(separator0);
    const p_tail = toMatcher(tail0);
    type head = matcherResultType<head_m>
    type body = matcherResultType<body_m>
    type separator = matcherResultType<separator_m>
    type tail = matcherResultType<tail_m>
    type result = parserResult & {
        head: head;
        body: body[];
        separators: separator[];
        tail: tail;
    }
    
    return function(state0: parserState): result | u {
        const state = state0.clone();
        const head = p_head(state.skipSpaces());
        if(!head)return;
        const body: body[] = [];
        const separators: separator[] = [];
        for(;;){
           const bodyFrag = p_body(state.skipSpaces());
           if(!bodyFrag)break;
           body.push(bodyFrag);
           const separator = p_separator(state.skipSpaces());
           if(!separator)break;
           separators.push(separator);
        }
        const tail = p_tail(state.skipSpaces());
        if(!tail)return;
        return {
            start: state0.i,
            end: state.i,
            input: state.input,

            head,
            body,
            separators,
            tail,
        }
    }
}

const res = parseListLike("[",/[0-9]+/,",","]")(new parserState("[0, 1, 3, 6]",0));




if(res){
    const a = res.head;
    a.match
}
