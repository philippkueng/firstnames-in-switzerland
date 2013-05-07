class FirstnameController < ApplicationController
    def create
        @firstname = Firstname.new(:name => params[:name], :rank => params[:rank].to_i, :count => params[:count].to_i, :year => 'index')
        if @firstname.save
            render :json => {:message => 'saved'}, :callback => params[:callback]
        else
            render :json => {:message => 'error'}, :callback => params[:callback]
        end
    end

    def index
        @firstnames = Firstname.limit(10)
        render :json => @firstnames, :callback => params[:callback]
    end
end
