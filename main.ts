# Define the number of neopixels and their pins
np0 = neopixel.NeoPixel(pin0, 12)
np1 = neopixel.NeoPixel(pin1, 12)
np2 = neopixel.NeoPixel(pin2, 12)
np3 = neopixel.NeoPixel(pin3, 12)
np4 = neopixel.NeoPixel(pin4, 12)

# Define the initial positions and velocities of the aliens and spaceship
alien_pos = [0, 11, 22, 33, 44]
alien_vel = [1, 1, 1, 1, 1]
spaceship_pos = 27
spaceship_vel = 0

# Define the colors of the aliens and spaceship
alien_color = (255, 0, 0)
spaceship_color = (0, 0, 255)

# Define the shooting variables
shoot_pos = -1
shoot_vel = -1
shoot_color = (255, 255, 255)

# Define the game loop
while True:
    # Clear the neopixels
np0.clear()
np1.clear()
np2.clear()
np3.clear()
np4.clear()
    
    # Move the aliens
for i in range(len(alien_pos)):
    alien_pos[i] += alien_vel[i]
if alien_pos[i] < 0 or alien_pos[i] >= 60:
alien_vel[i] = -alien_vel[i]
        # Draw the alien
if alien_pos[i] < 12:
    np0[alien_pos[i]] = alien_color
elif alien_pos[i] < 24:
np1[alien_pos[i] - 12] = alien_color
elif alien_pos[i] < 36:
np2[alien_pos[i] - 24] = alien_color
elif alien_pos[i] < 48:
np3[alien_pos[i] - 36] = alien_color
        else:
np4[alien_pos[i] - 48] = alien_color
        
    # Move the spaceship
spaceship_pos += spaceship_vel
if spaceship_pos < 0:
    spaceship_pos = 0
elif spaceship_pos >= 60:
spaceship_pos = 59
    # Draw the spaceship
if spaceship_pos < 12:
    np0[spaceship_pos] = spaceship_color
elif spaceship_pos < 24:
np1[spaceship_pos - 12] = spaceship_color
elif spaceship_pos < 36:
np2[spaceship_pos - 24] = spaceship_color
elif spaceship_pos < 48:
np3[spaceship_pos - 36] = spaceship_color
    else:
np4[spaceship_pos - 48] = spaceship_color
    
    # Handle shooting
if shoot_pos == -1 and button_a.is_pressed():
        # Start shooting from spaceship
shoot_pos = spaceship_pos - 1
shoot_vel = -1
elif shoot_pos != -1:
        # Move the shoot
shoot_pos += shoot_vel
if shoot_pos < 0 or shoot_pos >= 60 or(
    (shoot_pos < 12 and np0[shoot_pos] != (0, 0, 0))
or(shoot_pos < 24 and np1[shoot_pos - 12] != (0, 0, 0))
or(shoot_pos < 36 and np2[shoot_pos - 24] != (0, 0, 0))
or(shoot_pos < 48 and np3[shoot_pos - 36] != (0, 0, 0))
or(shoot_pos < 60 and np4[shoot_pos - 48] != (0, 0, 0))):
            # Stop shooting when hit the edge or an alien
shoot_pos = -1
        else:
            # Draw the shoot
if shoot_pos < 12:
    np0[shoot_pos] = shoot_color
elif shoot_pos < 24:
np1[shoot_pos - 12] = shoot_color
elif shoot_pos < 36:
np2[shoot_pos - 24] = shoot_color
elif shoot_pos < 48:
np3[shoot_pos - 36] = shoot_color
            else:
np4[shoot_pos - 48] = shoot_color
    
    # Handle alien hit by shoot
if shoot_pos != -1:
    for i in range(len(alien_pos)):
        if alien_pos[i] == shoot_pos:
            alien_pos[i] = -1
shoot_pos = -1
                # Clear the hit alien
if alien_pos[i] < 12:
    np0[alien_pos[i]] = (0, 0, 0)
elif alien_pos[i] < 24:
np1[alien_pos[i] - 12] = (0, 0, 0)
elif alien_pos[i] < 36:
np2[alien_pos[i] - 24] = (0, 0, 0)
elif alien_pos[i] < 48:
np3[alien_pos[i] - 36] = (0, 0, 0)
                else:
np4[alien_pos[i] - 48] = (0, 0, 0)
    
    # Remove hit aliens
alien_pos = [x for x in alien_pos if x != -1]
    
    # Check for game over
    if len(alien_pos) == 0:
        for i in range(3):
            # Flash the neopixels three times when win
np0.fill((255, 255, 255))
np1.fill((255, 255, 255))
np2.fill((255, 255, 255))
np3.fill((255, 255, 255))
np4.fill((255, 255, 255))
np0.show()
np1.show()
np2.show()
np3.show()
np4.show()
sleep(500)
np0.clear()
np1.clear()
np2.clear()
np3.clear()
np4.clear()
np0.show()
np1.show()
np2.show()
np3.show()
np4.show()
sleep(500)
break
    
    # Display the neopixels
np0.show()
np1.show()
np2.show()
np3.show()
np4.show()
    
    # Handle user input
if button_b.is_pressed():
    spaceship_vel = 1
else:
spaceship_vel = 0
        
    # Pause to control the speed of the game
sleep(100)