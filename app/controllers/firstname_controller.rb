class FirstnameController < ApplicationController
    def create
        @firstname = Firstname.new(
          :name => params[:name],
          :rank => params[:rank].to_i,
          :count => params[:count].to_i,
          :sex => params[:sex],
          :year => params[:year]
        )
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

    # ---
    # non CRUD methods
    # ---
    
    def less_common_as
      current_firstname = Firstname.where(:name => params[:name], :year => 'index').first
      @firstname = Firstname.where(:rank => current_firstname.rank.to_i + 1, :year => 'index').first
      render :json => @firstname, :callback => params[:callback]
    end
end
