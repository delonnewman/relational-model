# frozen_string_literal: true

require 'erb'
require 'pathname'
require 'cgi'

require_relative 'literate_javascript'

class Renderer
  def root = Pathname(__dir__).join('..')
  def template = root.join('index.html.erb').read

  def render
    root.join('src').glob('*.literatejs').map do |file|
      content = LiterateJavaScript.new(file.read).to_html
      ERB.new(template).result(binding)
    end.join
  end
end
