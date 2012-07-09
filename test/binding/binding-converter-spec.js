/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */
var Montage = require("montage").Montage,
    Converter = require("montage/core/converter/converter").Converter;

var TestConverter = Montage.create(Converter, {

    convert: {
        value: function(value) {
            return "CONVERT" + value;
        }
    },

    revert: {
        value: function(value) {
            return value.replace("CONVERT", "");
        }
    }

});

describe("binding/binding-converter-spec", function() {

    var sourceObject, boundObject, bindingDescriptor;

    beforeEach(function() {
        sourceObject = Montage.create();
        boundObject = Montage.create();

        bindingDescriptor = {
            boundObject: boundObject,
            boundObjectPropertyPath: "bar",
            converter: TestConverter
        };
    })

    describe("involved in a two way binding", function() {

        it("should convert the value passed to the source when the binding is established", function() {
            boundObject.bar = "bar";

            Object.defineBinding(sourceObject, "foo", bindingDescriptor);

            expect(sourceObject.foo).toBe("CONVERTbar")
        });

        it("should convert the value passed to the source when the bound object's value changes", function() {
            boundObject.bar = "bar";

            Object.defineBinding(sourceObject, "foo", bindingDescriptor);

            boundObject.bar = "baz";

            expect(sourceObject.foo).toBe("CONVERTbaz")
        });


        it("should revert the value passed to the bound object when the source object's value changes", function() {
            boundObject.bar = "bar";

            Object.defineBinding(sourceObject, "foo", bindingDescriptor);

            sourceObject.foo = "CONVERTbaz";

            expect(boundObject.bar).toBe("baz")
        });

    });

    describe("involved in a one way binding", function() {

        beforeEach(function() {
            bindingDescriptor.oneway = true;
        });

        it("should convert the value passed to the source when the binding is established", function() {
            boundObject.bar = "bar";

            Object.defineBinding(sourceObject, "foo", bindingDescriptor);

            expect(sourceObject.foo).toBe("CONVERTbar")
        });

        it("should convert the value passed to the source when the bound object's value changes", function() {
            boundObject.bar = "bar";

            Object.defineBinding(sourceObject, "foo", bindingDescriptor);

            boundObject.bar = "baz";

            expect(sourceObject.foo).toBe("CONVERTbaz")
        });

        it("must not enable propagating a value from the source object to the bound object", function() {
            boundObject.bar = "bar";

            Object.defineBinding(sourceObject, "foo", bindingDescriptor);

            sourceObject.foo = "CONVERTbaz";

            expect(boundObject.bar).toBe("bar")
        });

    });

});
