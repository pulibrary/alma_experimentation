# frozen_string_literal: true

require 'rest-client'
require 'base64'
require 'securerandom'
require 'json'

KEY = '123'
URL = 'https://4ypja0mlne.execute-api.us-east-1.amazonaws.com/staging/webhooks'

to = ARGV[0]
msg = ARGV[1]

abort 'Invalid number of parameters' unless to && msg

puts "Challenging server at #{URL}"
challenge = SecureRandom.uuid
abort "Server didn't respond to challenge" unless
    RestClient.get("#{URL}?challenge=#{challenge}")
              .include? challenge

req = {
  action: 'sms',
  sms: {
    msg: msg,
    to: to
  }
}.to_json

digest = OpenSSL::Digest.new('sha256')
hmac = Base64.encode64(OpenSSL::HMAC.digest(digest, KEY, req))

puts 'Posting to server'
begin
  RestClient.post URL,
                  req,
                  content_type: :json,
                  'X-Exl-Signature' => hmac
  puts 'Done'
rescue StandardError => e
  puts "ERROR: #{e.http_code} #{e.response}"
end
