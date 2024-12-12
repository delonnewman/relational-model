# frozen_string_literal: true

require 'kramdown'
require 'kramdown-parser-gfm'

class LiterateJavaScript
  def initialize(content)
    @content = content
  end

  def to_html
    parse.map(&:to_html).join("\n")
  end
  alias to_s to_html

  class Snippet
    def initialize(code)
      @code = code
    end

    def to_html
      %(
        <div class="snippet">
            <div class="snippet-content">
                <pre class="snippet-code">#{@code}</pre>
            </div>
            <button type="button">evaluate</button>
        </div>
      )
    end
  end

  def lines
    return [] unless @content

    @content.lines
  end

  def parse
    @content.split("\n\n").map do |content|
      if content.start_with?(/\s{4}/)
        Snippet.new(content.lines.map { |line| line.sub(/^\s{4}/, '') }.join)
      else
        Kramdown::Document.new(content, input: 'GFM', no_auto_typographic: true)
      end
    end
  end
end
