
ac = 15
eloszals = {}
hitMod = 7
dmgMod = 4
for hit1 in range(1,21):
	print(hit1)
	for hit2 in range(1,21):
		for hit3 in range(1,21):
			for hit4 in range(1,21):
				for dmg1 in range(1,7):
					for dmg2 in range(1,7):
						for dmg3 in range(1,7):
							for dmg4 in range(1,7):
								td = 0
								if (hit1+hitMod >= ac):
									td += dmg1+dmgMod
								if (hit2+hitMod >= ac):
									td += dmg2+dmgMod
								if (hit3+hitMod >= ac):
									td += dmg3+dmgMod
								if (hit4+hitMod >= ac):
									td += dmg4+dmgMod

								if (td in eloszals):
									eloszals[td] += 1
								else:
									eloszals[td] = 1

print(eloszals)
"""
import math

eloszlas ={0: 3111696, 5: 3852576, 6: 3852576, 7: 3852576, 8: 3852576, 9: 3852576, 10: 5641272, 11: 3577392, 12: 5366088, 13: 7154784, 14: 8943480, 15: 11101272, 16: 10050768, 17: 9369360, 18: 9057048, 19: 9113832, 20: 9568273, 21: 9341644, 22: 10251202, 23: 10536812, 24: 10227035, 25: 9350432, 26: 7821320, 27: 6661304, 28: 5784701, 29: 5105828, 30: 4539002, 31: 3998540, 32: 3570125, 33: 2970344, 34: 2284880, 35: 1599416, 36: 999635, 37: 571220, 38: 285610, 39: 114244, 40: 28561}

varhato = 0
cc = 0
for kk in eloszlas.keys():
	cc += eloszlas[kk]

for kk in eloszlas.keys():
	varhato += (eloszlas[kk]/float(cc)) * kk

szorasNegyzet = 0

for kk in eloszlas.keys():
	szorasNegyzet += (eloszlas[kk]/float(cc)) * (kk-varhato)**2

print(varhato)
print(math.sqrt(szorasNegyzet))
"""
