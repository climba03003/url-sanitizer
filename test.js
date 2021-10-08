const t = require('tap')
const UrlSanitizer = require('.')

t.test('invalid', function (t) {
  t.plan(1)

  t.test('throw for mode', function (t) {
    t.plan(2)
    try {
      // eslint-disable-next-line
      new UrlSanitizer({ mode: "invalid" });
    } catch (err) {
      t.type(err, 'Error')
      t.same(
        err.message,
        'options.mode is expected to be either "path" or "url", but recieved "invalid"'
      )
    }
  })
})

t.test('function init', function (t) {
  t.plan(1)

  t.test('should not throw', function (t) {
    t.plan(1)
    UrlSanitizer()
    t.pass()
  })
})

t.test('mode `path`', function (t) {
  t.plan(3)
  const sanitizer = new UrlSanitizer()

  t.test('//abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('//abc')
    t.same(result, 'http://localhost/abc')
  })

  t.test('/abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc')
    t.same(result, 'http://localhost/abc')
  })

  t.test('/abc//bcd', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc//bcd')
    t.same(result, 'http://localhost/abc//bcd')
  })
})

t.test('mode `path` and keep port', function (t) {
  t.plan(3)
  const sanitizer = new UrlSanitizer({ base: 'http://localhost:80/' })

  t.test('//abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('//abc')
    t.same(result, 'http://localhost:80/abc')
  })

  t.test('/abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc')
    t.same(result, 'http://localhost:80/abc')
  })

  t.test('/abc//bcd', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc//bcd')
    t.same(result, 'http://localhost:80/abc//bcd')
  })
})

t.test('mode `path` and different base', function (t) {
  t.plan(3)
  const sanitizer = new UrlSanitizer()

  t.test('//abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('//abc', 'https://localhost/')
    t.same(result, 'https://localhost/abc')
  })

  t.test('/abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc', 'https://localhost/')
    t.same(result, 'https://localhost/abc')
  })

  t.test('/abc//bcd', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc//bcd', 'https://localhost/')
    t.same(result, 'https://localhost/abc//bcd')
  })
})

t.test('mode `path`, different base and keep port', function (t) {
  t.plan(3)
  const sanitizer = new UrlSanitizer()

  t.test('//abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('//abc', 'https://localhost:443/')
    t.same(result, 'https://localhost:443/abc')
  })

  t.test('/abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc', 'https://localhost:443/')
    t.same(result, 'https://localhost:443/abc')
  })

  t.test('/abc//bcd', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc//bcd', 'https://localhost:443/')
    t.same(result, 'https://localhost:443/abc//bcd')
  })
})

t.test('mode `url`', function (t) {
  t.plan(3)
  const sanitizer = new UrlSanitizer({ mode: 'url' })

  t.test('//abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('//abc')
    t.same(result, 'http://abc/')
  })

  t.test('/abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc')
    t.same(result, 'http://localhost/abc')
  })

  t.test('/abc//bcd', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc//bcd')
    t.same(result, 'http://localhost/abc//bcd')
  })
})

t.test('mode `url` and keep port', function (t) {
  t.plan(3)
  const sanitizer = new UrlSanitizer({
    mode: 'url',
    base: 'http://localhost:80/'
  })

  t.test('//abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('//abc')
    t.same(result, 'http://abc/')
  })

  t.test('/abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc')
    t.same(result, 'http://localhost:80/abc')
  })

  t.test('/abc//bcd', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc//bcd')
    t.same(result, 'http://localhost:80/abc//bcd')
  })
})

t.test('mode `url` and different base', function (t) {
  t.plan(3)
  const sanitizer = new UrlSanitizer({
    mode: 'url'
  })

  t.test('//abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('//abc', 'https://localhost/')
    t.same(result, 'https://abc/')
  })

  t.test('/abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc', 'https://localhost/')
    t.same(result, 'https://localhost/abc')
  })

  t.test('/abc//bcd', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc//bcd', 'https://localhost/')
    t.same(result, 'https://localhost/abc//bcd')
  })
})

t.test('mode `url`, different base and keep port', function (t) {
  t.plan(3)
  const sanitizer = new UrlSanitizer({
    mode: 'url'
  })

  t.test('//abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('//abc', 'https://localhost:443/')
    t.same(result, 'https://abc/')
  })

  t.test('/abc', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc', 'https://localhost:443/')
    t.same(result, 'https://localhost:443/abc')
  })

  t.test('/abc//bcd', function (t) {
    t.plan(1)
    const result = sanitizer.parse('/abc//bcd', 'https://localhost:443/')
    t.same(result, 'https://localhost:443/abc//bcd')
  })
})
