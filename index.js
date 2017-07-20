/**
*	overload - Implementation of method overloading. Return a method which tries to match
* it's arguments to one of several other passed methods.
* @param {Object[]} definitions - A list of definitions.
* @param {Class|null|undefined[]} definitions[].args - Types in order to match against function arguments.
* @param {Function} defintions[].method - The method corresponding to the arguments.
* @returns {Function} match - The matched method to call.
*/
module.exports = function overload(definitions) {
	if (definitions.empty) {
		throw new Error('No definitions passed to method overload');
	}

	function matchArgument(arg, type) {
		switch(type) {
			case Number:
				return typeof arg === 'number';
			case Array:
				return Array.isArray(arg);
			case String:
				return typeof arg === 'string';
			case Boolean:
				return typeof arg === 'boolean' || (typeof arg === 'object' && arg.valueOf === 'boolean');
			case Function:
				return typeof arg === 'function';
			case null:
				return arg === null;
			case undefined:
				return typeof arg === 'undefined';
			default:
				return arg instanceof type;
		}
	}

	function matchDefinition(args) {
		for (var defIndex = 0, defintion; defIndex < definitions.length; defIndex++) {
			definition = definitions[defIndex];

			if (definition.args.length !== args.length) continue;

			if (args.every(function(arg, index) {
				return matchArgument(arg, definition.args[index]);
			})) {
				return definition.method;
			}
		};
	}

	return function() {
		var args = Array.prototype.slice.call(arguments, 0);
		var method = matchDefinition(args);

		if (typeof method === 'function') {
			return method.apply(this, args);
		} else {
			throw new Error('No matching method for', args);
		}
	}
}
