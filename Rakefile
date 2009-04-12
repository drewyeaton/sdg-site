Dir['tasks/**/*.rake'].sort.each { |rakefile| load rakefile }

task :default do
  puts 'This is an example rake task.'
end

require 'net/sftp'
 
task :deploy do
  # Compile the Nanoc website. The --all paramater means check every single file, not just the ones that
  # Nanoc believes may have been changed.
  puts `nanoc compile --all`
  
  puts 'Uploading site...'
  remote_directory = '/httpdocs/new/'
  local_directory = '/Users/drew/Documents/Projects/Sentinel Design Group/site/output/'
  
  # Net::SFTP doesn't include a function to recursively delete a directory, so I wrote one myself
  # in a few minutes.
  def delete_folder_contents(directory, client)
    # Firstly, get every single file into an array, then remove entries that will make us loop forever.
    entries = client.dir.entries(directory).reject {|file| file.name == '.' || file.name == '..' || file.name == directory}
  
    entries.each do |entry|    
      if entry.directory?  
        # If the entry is a directory, we run this function again to delete any files inside that subdirectory.
        # There is no limit to how deep the script will go.    
        delete_folder_contents(directory + '/' + entry.name, client)
        
        # After all files have been removed from the directory, delete the now empty directory.
        client.rmdir(directory + '/' + entry.name)
      else
        # If the entry is just a file, then delete it.
        client.remove!(directory + '/' + entry.name)
      end
    end
  end
  
  # Connect to the server using Net::SFTP. Obviously, my credentials have been removed.
  Net::SFTP.start('sentineldesign.net', 'sentineldesign', :password => 'and1rew') do |client|
    # Delete the contents of the blog's remote folder using the above function.
    delete_folder_contents(remote_directory, client)
    
    # Delete the actual remote directory itself.
    client.rmdir!(remote_directory)
  
    # Create and copy over the site to it's new destination on the remote server.
    client.upload!(local_directory, remote_directory)
  end
  
  puts 'Site deployed successfully.'
end