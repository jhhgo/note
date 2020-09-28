# SpringBoot异常处理

## SprintBoot错误处理机制

在没有自定义任何错误处理时，SpringBoot会自动返回一个默认的错误页面

而SprintBoot中和错误页面有关的配置就在**ErrorMvcAutoConfiguration**类中。ErrorMvcAutoConfiguration给容器中添加了以下几个重要的组件

```java
	@Bean
	@ConditionalOnMissingBean(value = ErrorAttributes.class, search = SearchStrategy.CURRENT)
	public DefaultErrorAttributes errorAttributes() {}

	@Bean
	@ConditionalOnMissingBean(value = ErrorController.class, search = SearchStrategy.CURRENT)
	public BasicErrorController basicErrorController(ErrorAttributes errorAttributes,
			ObjectProvider<ErrorViewResolver> errorViewResolvers) {}

	@Bean
	public ErrorPageCustomizer errorPageCustomizer(DispatcherServletPath dispatcherServletPath) {}

	@Bean
	@ConditionalOnBean(DispatcherServlet.class)
	@ConditionalOnMissingBean(ErrorViewResolver.class)
	DefaultErrorViewResolver conventionErrorViewResolver() {}

	
```

步骤：

1. 系统出现4xx、5xx的错误以后，ErrorPageCustomizer就会生效，ErrorPageCustomizer会定制错误的响应规则。

   下面看看源码。ErrorPageCustomizer中的registerErrorPages()方法，可以看到该方法想errorPageRegistry添加了一个默认请求路径 /error。

   ```java
   @Override
   public void registerErrorPages(ErrorPageRegistry errorPageRegistry) {
   	ErrorPage errorPage = new  ErrorPage(this.dispatcherServletPath.getRelativePath(this.properties.getError().getPath()));
       
   			errorPageRegistry.addErrorPages(errorPage);
   		}
   ```

   ```java
   public class ErrorProperties { 
       /**    * Path of the error controller.    */ 
       @Value("${error.path:/error}")
       private String path = "/error";
   }
   ```

2.BasicErrorController处理/error请求。其中关键的方法就是errorHtml()。errorHtml()调用resolveErrorView()得到一个ModelAndView对象。

```java
	// produces = MediaType.TEXT_HTML_VALUE 表示返回html页面
	@RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
	public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
        // 获取状态码
		HttpStatus status = getStatus(request);
		Map<String, Object> model = Collections
				.unmodifiableMap(getErrorAttributes(request, isIncludeStackTrace(request, MediaType.TEXT_HTML)));
		response.setStatus(status.value());
        // 获得ModelAndView对象
		ModelAndView modelAndView = resolveErrorView(request, response, status, model);
		return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);
	}

```

```java
protected ModelAndView resolveErrorView(HttpServletRequest request, HttpServletResponse response, 		HttpStatus status,Map<String, Object> model) {
		for (ErrorViewResolver resolver : this.errorViewResolvers) {
			ModelAndView modelAndView = resolver.resolveErrorView(request, status, model);
			if (modelAndView != null) {
				return modelAndView;
			}
		}
		return null;
	}
```

3.在resolveErrorView()方法中，遍历了每个ErrorViewResolver对象，调用ErrorViewResolver对象的resolveErrorView()方法得到ModelAndView对象()，这里就涉及到了之前提到过的另外一个组件DefaultErrorViewResolver。首先DefaultErrorViewResolver自然也是实现了ErrorViewResolver()接口。让我们来看看它的resolveErrorView()方法。可以看到resolveErrorView()中调用了resolve()方法，让我们接着看源码。

```java
	@Override
	public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {
		ModelAndView modelAndView = resolve(String.valueOf(status.value()), model);
		if (modelAndView == null && SERIES_VIEWS.containsKey(status.series())) {
			modelAndView = resolve(SERIES_VIEWS.get(status.series()), model);
		}
		return modelAndView;
	}

```

```java
private ModelAndView resolve(String viewName, Map<String, Object> model) {
    	// 要访问的页面路径其实就是 error/状态码
		String errorViewName = "error/" + viewName;
    	// 如果模板引擎起作用就用模板引擎的
		TemplateAvailabilityProvider provider = this.templateAvailabilityProviders.getProvider(errorViewName,
				this.applicationContext);
		if (provider != null) {
			return new ModelAndView(errorViewName, model);
		}
		return resolveResource(errorViewName, model);
	}
```

4.最后一个DefaultErrorAttributes组件，它的作用其实就是封装页面的信息。

```java
	@Override
	public Map<String, Object> getErrorAttributes(WebRequest webRequest, boolean includeStackTrace) {
		Map<String, Object> errorAttributes = new LinkedHashMap<>();
		errorAttributes.put("timestamp", new Date());
		addStatus(errorAttributes, webRequest);
		addErrorDetails(errorAttributes, webRequest, includeStackTrace);
		addPath(errorAttributes, webRequest);
		return errorAttributes;
	}
```

### 一句话总结

1. ErrorPageCustomizer定制发生错误时的响应规则，即要请求的路径
2. BasicErrorController处理由ErrorPageCustomizer定制的请求路径
3. DefaultErrorViewResolver生成要请求的页面的ModelAndView对象
4. DefaultErrorAttributes封装错误页面的信息

## 定制错误页面

1. 有模板引擎的情况下：将定制的错误页面放到templates/error/下。将错误页面命名为错误码.html，当产生该错误码时就会访问这个页面。也可以使用4xx.html，这样只要产生以4开头的错误都会访问这个页面。
2. 没有模板引擎的情况下：将定制的错误页面放在类路径静态资源的error目录下。例如/META-INF/resources/error、/static/error、/public/error等。命名规则与上条一样。

