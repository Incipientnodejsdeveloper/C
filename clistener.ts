import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { CLexer } from './Programming_in_c/CLexer';
import { CParser, DeclarationListContext, FunctionDefinitionContext, IterationStatementContext, } from './Programming_in_c/CParser';
import fs from 'fs';

const program = fs.readFileSync('./test.c', { encoding: 'utf-8' });

// Create the lexer and parser
let inputStream = CharStreams.fromString(program);
let lexer = new CLexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new CParser(tokenStream);

// Parse the input, where `program` is whatever entry point you defined
let tree = parser.translationUnit();


import { CListener } from './Programming_in_c/CListener';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';

let id = 0;
let parse: any = [];

class EnterFunctionListener implements CListener {

    GenParse = (cxt: any, type: string) => {
        id = id + 1
        let startLine: any = cxt.start?.line;
        let stopLine: any = cxt._stop?.line;
        let start: number = cxt._start?.startIndex;
        let stop: any = cxt._stop?.stopIndex;
        return {
            id: id,
            line: [startLine, stopLine],
            text: program.slice(start, stop + 1),
            type,
        };
    }

    enterDeclarationList(ctx: DeclarationListContext) {
        parse.push(this.GenParse(ctx, 'declaration statement'))
    };

    enterIterationStatement(ctx: IterationStatementContext){
        parse.push(this.GenParse(ctx, 'iteration statement'))
    }

    enterFunctionDefinition(ctx: FunctionDefinitionContext) {
        parse.push(this.GenParse(ctx, 'function statement'))
    };

    // other enterX functions...
}

// Create the listener
const listener: CListener = new EnterFunctionListener();
// Use the entry point for listeners
ParseTreeWalker.DEFAULT.walk(listener, tree);

fs.writeFileSync('test.json',JSON.stringify(parse));

console.dir({ parse }, { depth: null })


