// Generated by CoffeeScript 1.3.3
var And, ArgumentDeclaration, ArgumentList, Assign, Assignment, CallArgument, CurlyBraces, Dereference, Divide, Equal, Expression, For, FunctionDefinition, GreaterEqual, Identifier, IfElseStatement, Include, Index, IntersectionFor, LessThan, LowerEqual, Minus, ModuleBody, ModuleDefinition, ModuleInstantiation, Modulo, MoreThan, Multiply, Negate, NotEqual, Or, Plus, Range, TernaryIf, UnaryMinus, Use, Vector;

Assignment = (function() {
  "`identifier` = `expr` ;";

  function Assignment(identifier, expression) {
    this.identifier = identifier;
    this.expression = expression;
    return;
  }

  Assignment.prototype.pprint = function() {
    return this.identifier.pprint() + ' = ' + this.expression.pprint() + ';';
  };

  Assignment.prototype.dump = function() {
    return '<assignment id=' + this.identifier.dump() + ' value=' + this.expression.dump() + '>';
  };

  return Assignment;

})();

Include = (function() {
  "include <`name`>;";

  function Include(name) {
    this.name = name;
    return;
  }

  Include.prototype.pprint = function() {
    return 'include <' + this.name + '>;';
  };

  Include.prototype.dump = function() {
    return '<include filename=' + this.name + '>';
  };

  return Include;

})();

Use = (function() {
  "use <`name`>;";

  function Use(name) {
    this.name = name;
    return;
  }

  Use.prototype.pprint = function() {
    return 'use <' + this.name + '>;';
  };

  Use.prototype.dump = function() {
    return '<use filename=' + this.name + '>';
  };

  return Use;

})();

ModuleDefinition = (function() {
  "module `identifier` ( `arguments` ) `body`";

  function ModuleDefinition(parent, identifier, _arguments, body) {
    var _ref;
    this.parent = parent;
    this.identifier = identifier;
    this["arguments"] = _arguments;
    this.body = body;
    if ((_ref = this["arguments"]) == null) {
      this["arguments"] = new ArgumentList();
    }
    return;
  }

  ModuleDefinition.prototype.pprint = function() {
    return 'module ' + this.identifier.pprint() + this["arguments"].pprint() + (this.body != null ? ' ' + this.body.pprint() : ';');
  };

  ModuleDefinition.prototype.dump = function() {
    return '<module id=' + this.identifier.dump() + ' args=' + this["arguments"].dump() + '>\n   ' + this.body.dump().split('\n').join('\n   ') + '\n</module>';
  };

  return ModuleDefinition;

})();

FunctionDefinition = (function() {
  "function `identifier` ( `arguments` ) = `expr` ;";

  function FunctionDefinition(identifier, _arguments, body) {
    this.identifier = identifier;
    this["arguments"] = _arguments;
    this.body = body;
    return;
  }

  FunctionDefinition.prototype.pprint = function() {
    return 'function ' + this.identifier.pprint() + this["arguments"].pprint() + ' = ' + this.body.pprint() + ';';
  };

  FunctionDefinition.prototype.dump = function() {
    return '<function id=' + this.identifier.dump() + ' args=' + this["arguments"].dump() + ' expr=' + this.body.dump() + '>';
  };

  return FunctionDefinition;

})();

For = (function() {
  "for ( `arguments` ) `expr` ;";

  function For(_arguments, body) {
    this["arguments"] = _arguments;
    this.body = body;
    return;
  }

  For.prototype.pprint = function() {
    return 'for(' + this["arguments"].pprint() + ') ' + this.body.pprint();
  };

  For.prototype.dump = function() {
    return '<for args=' + this["arguments"].dump() + '>\n' + this.body.dump().split('\n').join('\n   ') + '\n</for>';
  };

  return For;

})();

IntersectionFor = (function() {
  "intersection_for ( `arguments` ) `expr` ;";

  function IntersectionFor(_arguments, body) {
    this["arguments"] = _arguments;
    this.body = body;
    return;
  }

  IntersectionFor.prototype.pprint = function() {
    return 'intersection_for ' + this["arguments"].pprint() + ' ' + this.body.pprint();
  };

  IntersectionFor.prototype.dump = function() {
    return '<intersection_for args=' + this["arguments"].dump() + '>\n' + this.body.dump().split('\n').join('\n   ') + '\n</for>';
  };

  return IntersectionFor;

})();

Assign = (function() {
  "assign ( `arguments` ) `body` ;";

  function Assign(_arguments, body) {
    this["arguments"] = _arguments;
    this.body = body;
    return;
  }

  Assign.prototype.pprint = function() {
    return 'assign' + this["arguments"].pprint() + ' ' + this.body.pprint() + ';';
  };

  Assign.prototype.dump = function() {
    return '<assign args=' + this["arguments"].dump() + ' expr=' + this.body.dump() + '>';
  };

  return Assign;

})();

IfElseStatement = (function() {
  "if ( `condition` ) \n    `body`\n[ else\n    `else_body` ]";

  function IfElseStatement(condition, body) {
    this.condition = condition;
    this.body = body;
    this.else_body = null;
    return;
  }

  IfElseStatement.prototype.pprint = function() {
    var s;
    s = 'if(' + this.condition.pprint() + ') ' + this.body.pprint();
    if (this.else_body) {
      s += ' else ' + this.else_body.pprint();
    }
    return s;
  };

  IfElseStatement.prototype.dump = function() {
    var s;
    s = '<if cond=' + this.condition.dump() + '>\n';
    s += '   ' + this.body.dump().split('\n').join('\n   ');
    if (this.else_children) {
      s += '\n<else>\n   ' + this.else_body.dump().split('\n').join('\n   ');
    }
    s += '</if>';
    return s;
  };

  return IfElseStatement;

})();

ModuleBody = (function() {

  function ModuleBody() {
    this.children = [];
    return;
  }

  ModuleBody.prototype.pprint = function() {
    var c;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.pprint());
      }
      return _results;
    }).call(this)).join('\n').split('\n').join('\n');
  };

  ModuleBody.prototype.dump = function() {
    var c;
    return '<module>\n   ' + ((function() {
      var _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.dump());
      }
      return _results;
    }).call(this)).join('\n').split('\n').join('\n   ') + '\n</module>';
  };

  return ModuleBody;

})();

ModuleInstantiation = (function() {
  "`identifier` ( `arguments` ) `body`";

  function ModuleInstantiation(identifier, _arguments) {
    var _ref;
    this.identifier = identifier;
    this["arguments"] = _arguments;
    if ((_ref = this["arguments"]) == null) {
      this["arguments"] = new ArgumentList();
    }
    this.body = null;
    this.tag_root = false;
    this.tag_highlight = false;
    this.tag_background = false;
    return;
  }

  ModuleInstantiation.prototype.tags = function() {
    var s;
    s = '';
    if (this.tag_root) {
      s += '!';
    }
    if (this.tag_highlight) {
      s += '#';
    }
    if (this.tag_background) {
      s += '%';
    }
    return s;
  };

  ModuleInstantiation.prototype.pprint = function() {
    return this.tags() + this.identifier.pprint() + this["arguments"].pprint() + (this.body ? ' ' + this.body.pprint() : ';');
  };

  ModuleInstantiation.prototype.dump = function() {
    return '<module-inst tags=' + this.tags() + ' id=' + this.identifier.dump() + ' args=' + this["arguments"].dump() + '>\n   ' + (this.body ? this.body.dump() : '') + '\n</module-inst>';
  };

  return ModuleInstantiation;

})();

Identifier = (function() {
  "Any identifier name";

  function Identifier(name) {
    this.name = name;
    return;
  }

  Identifier.prototype.pprint = function() {
    return this.name;
  };

  Identifier.prototype.dump = function() {
    return '<identifier name=' + this.name + '>';
  };

  return Identifier;

})();

Dereference = (function() {
  "Dereferences a property of an expression";

  function Dereference(expression, identifier) {
    this.expression = expression;
    this.identifier = identifier;
    return;
  }

  Dereference.prototype.pprint = function() {
    return this.expression.pprint() + '.' + this.identifier.pprint();
  };

  Dereference.prototype.dump = function() {
    return '<dereference expr=' + this.expression.dump() + ' identifier=' + this.identifier.dump() + '>';
  };

  return Dereference;

})();

Range = (function() {
  "A range of expression [`start`, `end`] or [`start`, `increment`, `end`]";

  function Range(start, increment, end) {
    this.start = start;
    this.increment = increment;
    this.end = end;
    return;
  }

  Range.prototype.pprint = function() {
    return '[' + this.start.pprint() + (this.increment != null ? ':' + this.increment.pprint() : '') + ':' + this.end.pprint() + ']';
  };

  Range.prototype.dump = function() {
    return '<range start=' + this.start + ' increment=' + this.increment + ' end=' + this.end + '>';
  };

  return Range;

})();

Vector = (function() {
  "A vector like [`first`, `second`, `third`, ...]";

  function Vector() {
    this.children = [];
    return;
  }

  Vector.prototype.pprint = function() {
    var c;
    return '[' + ((function() {
      var _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.pprint());
      }
      return _results;
    }).call(this)).join(', ') + ']';
  };

  Vector.prototype.dump = function() {
    var c;
    return '<vector>\n   ' + ((function() {
      var _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.dump());
      }
      return _results;
    }).call(this)).join('\n').split('\n').join('\n   ') + '\n</vector>';
  };

  return Vector;

})();

Expression = (function() {
  "Any basic type value: bool, string, number.";

  function Expression(value) {
    this.value = value;
    return;
  }

  Expression.prototype.pprint = function() {
    return this.value;
  };

  Expression.prototype.dump = function() {
    return '<expression value=' + this.value + '>';
  };

  return Expression;

})();

Multiply = (function() {

  function Multiply(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  Multiply.prototype.pprint = function() {
    return this.left.pprint() + ' * ' + this.right.pprint();
  };

  Multiply.prototype.dump = function() {
    return '<multiply>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</multiply>';
  };

  return Multiply;

})();

Divide = (function() {

  function Divide(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  Divide.prototype.pprint = function() {
    return this.left.pprint() + ' / ' + this.right.pprint();
  };

  Divide.prototype.dump = function() {
    return '<divide>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</divide>';
  };

  return Divide;

})();

Modulo = (function() {

  function Modulo(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  Modulo.prototype.pprint = function() {
    return this.left.pprint() + ' % ' + this.right.pprint();
  };

  Modulo.prototype.dump = function() {
    return '<modulo>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</modulo>';
  };

  return Modulo;

})();

Plus = (function() {

  function Plus(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  Plus.prototype.pprint = function() {
    return this.left.pprint() + ' + ' + this.right.pprint();
  };

  Plus.prototype.dump = function() {
    return '<plus>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</plus>';
  };

  return Plus;

})();

Minus = (function() {

  function Minus(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  Minus.prototype.pprint = function() {
    return this.left.pprint() + ' - ' + this.right.pprint();
  };

  Minus.prototype.dump = function() {
    return '<minus>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</minus>';
  };

  return Minus;

})();

LessThan = (function() {
  " Evaluates to a boolean expression which is true if `left` is less than `right` ";

  function LessThan(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  LessThan.prototype.pprint = function() {
    return this.left.pprint() + ' < ' + this.right.pprint();
  };

  LessThan.prototype.dump = function() {
    return '<less-than>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</less-than>';
  };

  return LessThan;

})();

LowerEqual = (function() {
  " Evaluates to a boolean expression which is true if `left` is less or equal than `right` ";

  function LowerEqual(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  LowerEqual.prototype.pprint = function() {
    return this.left.pprint() + ' <= ' + this.right.pprint();
  };

  LowerEqual.prototype.dump = function() {
    return '<lower-or-equal>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</lower-or-equal>';
  };

  return LowerEqual;

})();

Equal = (function() {
  " Evaluates to a boolean expression which is true if `left` is equal to `right` ";

  function Equal(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  Equal.prototype.pprint = function() {
    return this.left.pprint() + ' == ' + this.right.pprint();
  };

  Equal.prototype.dump = function() {
    return '<equals>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</equals>';
  };

  return Equal;

})();

NotEqual = (function() {

  function NotEqual(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  NotEqual.prototype.pprint = function() {
    return this.left.pprint() + ' != ' + this.right.pprint();
  };

  NotEqual.prototype.dump = function() {
    return '<not-equal>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</not-equal>';
  };

  return NotEqual;

})();

GreaterEqual = (function() {

  function GreaterEqual(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  GreaterEqual.prototype.pprint = function() {
    return this.left.pprint() + ' >= ' + this.right.pprint();
  };

  GreaterEqual.prototype.dump = function() {
    return '<greater-or-equal>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</greater-or-equal>';
  };

  return GreaterEqual;

})();

MoreThan = (function() {

  function MoreThan(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  MoreThan.prototype.pprint = function() {
    return this.left.pprint() + ' > ' + this.right.pprint();
  };

  MoreThan.prototype.dump = function() {
    return '<more-than>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</more-than>';
  };

  return MoreThan;

})();

And = (function() {

  function And(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  And.prototype.pprint = function() {
    return this.left.pprint() + ' && ' + this.right.pprint();
  };

  And.prototype.dump = function() {
    return '<and>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</and>';
  };

  return And;

})();

Or = (function() {

  function Or(left, right) {
    this.left = left;
    this.right = right;
    return;
  }

  Or.prototype.pprint = function() {
    return this.left.pprint() + ' || ' + this.right.pprint();
  };

  Or.prototype.dump = function() {
    return '<or>\n   ' + this.left.dump() + '\n   ' + this.right.dump() + '</or>';
  };

  return Or;

})();

Negate = (function() {

  function Negate(expression) {
    this.expression = expression;
    return;
  }

  Negate.prototype.pprint = function() {
    return '!' + this.expression.pprint();
  };

  Negate.prototype.dump = function() {
    return '<not>' + this.expression.dump() + '</not>';
  };

  return Negate;

})();

UnaryMinus = (function() {

  function UnaryMinus(expression) {
    this.expression = expression;
    return;
  }

  UnaryMinus.prototype.pprint = function() {
    return '-' + this.expression.pprint();
  };

  UnaryMinus.prototype.dump = function() {
    return '<unary-minus>' + this.expression.dump() + '</unary-minus>';
  };

  return UnaryMinus;

})();

TernaryIf = (function() {

  function TernaryIf(condition, true_expression, false_expression) {
    this.condition = condition;
    this.true_expression = true_expression;
    this.false_expression = false_expression;
    return;
  }

  TernaryIf.prototype.pprint = function() {
    return this.condition.pprint() + '?' + this.true_expression.pprint() + ':' + this.false_expression;
  };

  TernaryIf.prototype.dump = function() {
    return '<ternary-if cond=' + this.condition.dump() + '>\n   ' + this.true_expression.dump() + '<else>\n   ' + this.false_expression.dump()('</ternary-if>');
  };

  return TernaryIf;

})();

Index = (function() {

  function Index(expression, index) {
    this.expression = expression;
    this.index = index;
    return;
  }

  Index.prototype.pprint = function() {
    return this.expression.pprint() + '[' + this.index.pprint() + ']';
  };

  Index.prototype.dump = function() {
    return '<index expression=' + this.expression.dump() + ' index=' + this.index.dump() + '>';
  };

  return Index;

})();

ArgumentList = (function() {

  function ArgumentList() {
    this.args = [];
    return;
  }

  ArgumentList.prototype.pprint = function() {
    var c;
    return '(' + ((function() {
      var _i, _len, _ref, _results;
      _ref = this.args;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.pprint());
      }
      return _results;
    }).call(this)).join(', ') + ')';
  };

  ArgumentList.prototype.dump = function() {
    var c;
    return '(' + ((function() {
      var _i, _len, _ref, _results;
      _ref = this.args;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.dump());
      }
      return _results;
    }).call(this)).join(', ') + ')';
  };

  return ArgumentList;

})();

ArgumentDeclaration = (function() {

  function ArgumentDeclaration(identifier, defaultvalue) {
    this.identifier = identifier;
    this.defaultvalue = defaultvalue;
    return;
  }

  ArgumentDeclaration.prototype.pprint = function() {
    return this.identifier.pprint() + (this.defaultvalue ? ' = ' + this.defaultvalue.pprint() : '');
  };

  ArgumentDeclaration.prototype.dump = function() {
    return '<arg-decl id=' + this.identifier.dump() + ' default=' + (this.defaultvalue ? this.defaultvalue.dump() : 'none') + '>';
  };

  return ArgumentDeclaration;

})();

CallArgument = (function() {

  function CallArgument(identifier, value) {
    this.identifier = identifier;
    this.value = value;
    return;
  }

  CallArgument.prototype.pprint = function() {
    return (this.identifier ? this.identifier.pprint() + ' = ' : '') + this.value.pprint();
  };

  CallArgument.prototype.dump = function() {
    return '<arg' + (this.identifier ? ' id=' + this.identifier.dump() : '') + ' value=' + this.value.dump() + '>';
  };

  return CallArgument;

})();

CurlyBraces = (function() {

  function CurlyBraces(children) {
    var _ref;
    this.children = children;
    if ((_ref = this.children) == null) {
      this.children = [];
    }
    return;
  }

  CurlyBraces.prototype.pprint = function() {
    var c;
    return '{\n   ' + ((function() {
      var _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.pprint());
      }
      return _results;
    }).call(this)).join('\n').split('\n').join('\n   ') + '\n}';
  };

  CurlyBraces.prototype.dump = function() {
    var c;
    return '<curly-braces>\n   ' + ((function() {
      var _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.dump());
      }
      return _results;
    }).call(this)).join('\n').split('\n').join('\n   ') + '\n</curly-braces>';
  };

  return CurlyBraces;

})();

if (typeof module !== "undefined" && module !== null) {
  module.exports = {
    Use: Use,
    Include: Include,
    Assignment: Assignment,
    ModuleDefinition: ModuleDefinition,
    FunctionDefinition: FunctionDefinition,
    For: For,
    IntersectionFor: IntersectionFor,
    Assign: Assign,
    IfElseStatement: IfElseStatement,
    ModuleBody: ModuleBody,
    ModuleInstantiation: ModuleInstantiation,
    Expression: Expression,
    Identifier: Identifier,
    Dereference: Dereference,
    Range: Range,
    Vector: Vector,
    Multiply: Multiply,
    Divide: Divide,
    Modulo: Modulo,
    Plus: Plus,
    Minus: Minus,
    LessThan: LessThan,
    LowerEqual: LowerEqual,
    Equal: Equal,
    NotEqual: NotEqual,
    GreaterEqual: GreaterEqual,
    MoreThan: MoreThan,
    And: And,
    Or: Or,
    Negate: Negate,
    UnaryMinus: UnaryMinus,
    TernaryIf: TernaryIf,
    Index: Index,
    Call: Call,
    ArgumentList: ArgumentList,
    ArgumentDeclaration: ArgumentDeclaration,
    CallArgument: CallArgument,
    CurlyBraces: CurlyBraces
  };
}
