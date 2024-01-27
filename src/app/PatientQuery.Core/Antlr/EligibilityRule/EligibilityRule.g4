grammar EligibilityRule;
 
parse
 : orExpr EOF
 ;

orExpr
 : andExpr ( OR andExpr )*
 ;

andExpr
 : expr ( AND expr )*
 ;

expr
 : '(' orExpr ')'
 | rule
 ;

rule
 : field=WORDS ':' operator=WORDS ':' value=STRING
 ;

AND : ' AND ' ;
OR : ' OR ' ;
WORDS : [ a-z]+ ;
STRING: '"' (ESC | ~["\\])* '"';
SPACE : [ \t\r\n] -> skip ;

fragment ESC: '\\' (["\\/bfnrt] | UNICODE);
fragment UNICODE : 'u' HEX HEX HEX HEX;
fragment HEX : [0-9a-fA-F];