#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
triviawidget <- function(questions) {
  # create widget
  htmlwidgets::createWidget(name = 'triviawidget', questions)
}

#' Shiny bindings for triviawidget
#'
#' Output and render functions for using triviawidget within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a triviawidget
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name triviawidget-shiny
#'
#' @export
triviawidgetOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'triviawidget', width, height, package = 'triviawidget')
}

#' @rdname triviawidget-shiny
#' @export
renderTriviawidget <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, triviawidgetOutput, env, quoted = TRUE)
}
