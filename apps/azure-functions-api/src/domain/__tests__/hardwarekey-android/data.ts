import { NonEmptyString } from '@pagopa/ts-commons/lib/strings';

const challenge = 'randomvalue';
const attestation =
  'TUlJQ2tqQ0NBamlnQXdJQkFnSUJBVEFLQmdncWhrak9QUVFEQWpBdk1Sa3dGd1lEVlFRRkV4QTVOek0xTXpjM09UTTJaREJrWkRjMApNUkl3RUFZRFZRUU1EQWxUZEhKdmJtZENiM2d3SWhnUE1qQXlOREEwTURJd09UUTVNRGhhR0E4eU1ESTRNRFV5TXpJek5UazFPVm93Ckh6RWRNQnNHQTFVRUF3d1VRVzVrY205cFpDQkxaWGx6ZEc5eVpTQkxaWGt3V1RBVEJnY3Foa2pPUFFJQkJnZ3Foa2pPUFFNQkJ3TkMKQUFSYVBaNlVtakRZNlFhNnFoQTZGWXZMcm91ZndrWXk0WjlWTWlENzBHNFNOc082L1BXNDdGUDdEd3pnWHRMNm16UVNtRnZlWVR2VgpFYVpHb0pVcGJhVm5vNElCVHpDQ0FVc3dEZ1lEVlIwUEFRSC9CQVFEQWdlQU1JSUJOd1lLS3dZQkJBSFdlUUlCRVFTQ0FTY3dnZ0VqCkFnRUVDZ0VDQWdFcENnRUNCQXR5WVc1a2IyMTJZV3gxWlFRQU1HSy9oVDBJQWdZQmpwNDJaSWUvaFVWU0JGQXdUakVvTUNZRUlXTnYKYlM1cGIzSmxZV04wYm1GMGFYWmxhVzUwWldkeWFYUjVaWGhoYlhCc1pRSUJBVEVpQkNENnhoZEYzQWtEZUcrNTdlWXFsaXM1bjNOSQo4THR2aVp1RE1tWjFrUU03bkRDQm9hRUZNUU1DQVFLaUF3SUJBNk1FQWdJQkFLVUZNUU1DQVFTcUF3SUJBYitEZHdJRkFMK0ZQZ01DCkFRQy9oVUJNTUVvRUlJZWMwL0dPcDI0a1RVMUt3N3k1d3pmQk8wWm5HUXNaQTFyK0pUWlZBRkR4QVFIL0NnRUFCQ0J5NnlyVXJDZGEKTXByeGhoNEZ6YmNwc3NMdlZhWk80TmJ6M3hpbUlDbUJyYitGUVFVQ0F3SDcwTCtGUWdVQ0F3TVdSTCtGVGdZQ0JBRTBzcFcvaFU4RwpBZ1FCTkxLVk1Bb0dDQ3FHU000OUJBTUNBMGdBTUVVQ0lEaEFXRlJmYStkWWU3OEErcUtZUTZOcnJmYi9CamIxZG1jcjZQTDVoa1RnCkFpRUE5QmV1MHRMQkZUOFJsRTM2dmdzTHMydHkrT0U2TzM5T01aanQ0djd4MU84PQosTUlJQ01EQ0NBYmVnQXdJQkFnSUtGWkJZVjBaeGRtTllOREFLQmdncWhrak9QUVFEQWpBdk1Sa3dGd1lEVlFRRkV4QTFOR1kxT1RNMwpNRFUwTW1ZMVlUazFNUkl3RUFZRFZRUU1EQWxUZEhKdmJtZENiM2d3SGhjTk1Ua3dOekkzTURFMU1qRTVXaGNOTWprd056STBNREUxCk1qRTVXakF2TVJrd0Z3WURWUVFGRXhBNU56TTFNemMzT1RNMlpEQmtaRGMwTVJJd0VBWURWUVFNREFsVGRISnZibWRDYjNnd1dUQVQKQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBUjJPWlk2dTMwemExOGpqWXMxWHYyemxhSXJMTTNtZTlva01vNUx2NEF2NzZsLwpJRTNZdmJSUU15eTE1V2IzV2IzRy82KzU4N3g0NDNSOS9PZ25qbDhDbzRHNk1JRzNNQjBHQTFVZERnUVdCQlJCUGp5cHMwdkhwUnk3CkFTWEFRaHZtVWExNjJEQWZCZ05WSFNNRUdEQVdnQlJwa0xFTU93aUs3aXI0akRPSHRDd1MydC9EcGpBUEJnTlZIUk1CQWY4RUJUQUQKQVFIL01BNEdBMVVkRHdFQi93UUVBd0lDQkRCVUJnTlZIUjhFVFRCTE1FbWdSNkJGaGtOb2RIUndjem92TDJGdVpISnZhV1F1WjI5dgpaMnhsWVhCcGN5NWpiMjB2WVhSMFpYTjBZWFJwYjI0dlkzSnNMekUxT1RBMU9EVTNORFkzTVRjMk5qTTFPRE0wTUFvR0NDcUdTTTQ5CkJBTUNBMmNBTUdRQ01CZWczemlBb2k2aDFMUGZ2YmJBU2s1V1ZkQzZjTDNJcGF4SU95Y01IbTFTRE5xWUFMT3RkMXV1amZ6TWVvYnMKK0FJd0tKajVYeVNHZTdNUkwwUU50ZHJTZDJua0srZmJqY1VjOExLdlZhcER3UkFDNDBDaVR6bGxBeSthT255RHhydmIKLE1JSUQxekNDQWIrZ0F3SUJBZ0lLQTRnbVoyQmxpWmFGOVRBTkJna3Foa2lHOXcwQkFRc0ZBREFiTVJrd0Z3WURWUVFGRXhCbU9USXcKTURsbE9EVXpZalppTURRMU1CNFhEVEU1TURnd09USXpNRE15TTFvWERUSTVNRGd3TmpJek1ETXlNMW93THpFWk1CY0dBMVVFQlJNUQpOVFJtTlRrek56QTFOREptTldFNU5URVNNQkFHQTFVRURBd0pVM1J5YjI1blFtOTRNSFl3RUFZSEtvWkl6ajBDQVFZRks0RUVBQ0lECllnQUU0MUluYjV2ODZrTUJwZkJDZjZaSGpsY3lDYTVFL1hZcys4Vjh1OVJ4TmpGUW5vQXVvT2xBVTI1VStpVnd5aWhHRlVhWUIxVUoKS1RzeEFMT1ZXME1YZG9zb2EvYitKbEhGbXZiR3NOc3pZQWtLUmtmSGhnNTI3TU80cDl0YzVYck1vNEcyTUlHek1CMEdBMVVkRGdRVwpCQlJwa0xFTU93aUs3aXI0akRPSHRDd1MydC9EcGpBZkJnTlZIU01FR0RBV2dCUTJZZUVBZklnRkNWR0xSR3hIL3hwTXllcFBFakFQCkJnTlZIUk1CQWY4RUJUQURBUUgvTUE0R0ExVWREd0VCL3dRRUF3SUNCREJRQmdOVkhSOEVTVEJITUVXZ1E2QkJoajlvZEhSd2N6b3YKTDJGdVpISnZhV1F1WjI5dloyeGxZWEJwY3k1amIyMHZZWFIwWlhOMFlYUnBiMjR2WTNKc0x6aEdOamN6TkVNNVJrRTFNRFEzT0RrdwpEUVlKS29aSWh2Y05BUUVMQlFBRGdnSUJBRnhaRXllZ3NDU2V5dHlVa1lUSlpSN1I4cVlYb1hVV1E1aDFRcDZiMGgrSC9TTmwwTnplCmRIQWl3WlFROGpxemdQNGM3dzlIcnJ4RVBDcEZNZDgreWtFQnY1Yld2RERmMkhqdFp6UmxNUkcxNTRLZ00xRE1KZ1hoS0xTS1YrZi8KSCtTL1FRVGVQM3lwck9hdnNCdmRrZ1g2RUxrWU42TTNKWHI3Z3BDdnBGYjZZcHo2NVVkN0Z5c0FtL0tOUTl6VTB4N2N2ejNCdHZ6OAp5bHc0cDVkejA0dGFuVHpOZ1ZMVkh5WDVrQWNCMmZ0UHZ4TUg0WC9QWGR4MWxBbUdQUzhQc3ViQ1JHakp4ZGhSVk9FRU1ZeXhDdVlMCm9udXlVZ2dPQnlaRmFCdzU1V0RvV0dwa1ZRaG5GaTlMM3AyM1ZrV0lMTG5xLzA3K0d3b3hMMXZVQWlRcGpKSHhOUVliamdUbytreGgKakRQM3VVTEFLUEFOR0JFNysyNVZxVkxNdGRjZTRFYjV2OXlGcWdnK0p0bEw0MVJVV1ZTM0RJRXF4T01tL2ZCM0E3dDU1VGJVS2Y4ZApDWnlCY2kyQmNVV1R4OEs3Vm5RTXk4Z0JNeXUxU0dsZUtQTElyQlJTb21EUDVYOHhHdHdUTG8zYUFkWTQrYVNqRW9pbUk2a1g5YmJJCmZoeURGcEp4S2FEUkh6aENVZExmSnJsQ3AyaEVxNUdXajBsVDUwaFBMczB0YmhoL2wzTFR0RmhLeVliaUI1dkhYeUIzUDRnVXVpMFcKeHlabllkYWpVRitUbjhNVzc5cUhod2hhWFU5SG5mbEUrZEJoMHNtYXpPYysweGR3WlpLWEVUK1VGQVVBTUdpSHZodUlDQ3VXc1k0UwpQS3Y4LzcxNXRvZUNvRUNIU012MDhDOUMKLE1JSUZZRENDQTBpZ0F3SUJBZ0lKQU9qNkdXTVUwdm9ZTUEwR0NTcUdTSWIzRFFFQkN3VUFNQnN4R1RBWEJnTlZCQVVURUdZNU1qQXcKT1dVNE5UTmlObUl3TkRVd0hoY05NVFl3TlRJMk1UWXlPRFV5V2hjTk1qWXdOVEkwTVRZeU9EVXlXakFiTVJrd0Z3WURWUVFGRXhCbQpPVEl3TURsbE9EVXpZalppTURRMU1JSUNJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBZzhBTUlJQ0NnS0NBZ0VBcjdiSGdpdXhwd0hzCks3UXVpOHhVRm1Pcjc1Z3ZNc2QvZFRFRERKZFNTeHRmNkFuN3h5cXBSUjkwUEwyYWJ4TTFkRXFsWG5mMnRxdzFOZTRYd2w1amxSZmQKbkpMbU4wcFR5LzRsajQvN3R2MFNrM2lpS2t5cG5FVXRSNldmTWdIMFFaZktITTErZGkreTlURlJ0djZ5Ly8wcmIrVCtXOGE5bnNOTAovZ2dqbmFyODY0NjFxTzByT3MyY1hqcDNrT0cxRkVKNU1WbUZtQkd0bnJLcGE3M1hwWHlUcVJ4Qi9NMG4xbi9XOW5HcUM0RlNZYTA0ClQ2TjVSSVpHQk4yejJNVDVJS0diRmxiQzhVclcwRHhXN0FZSW1RUWNIdEdsL20wMFFMVld1dEhRb1ZKWW5GUGxYVGNIWXZBU0x1K1IKaGhzYkRteE1nSkowbWNEcHZzQzRQanZCK1R4eXdFbGdTNzB2RTBYbUxEK09KdHZzQnNsSFp2UEJLQ09kVDBNUyt0Z1NPSWZnYSt6MQpaMWc3K0RWYWdmN3F1dm1hZzhqZlBpb3lLdnhuSy9FZ3NUVVZpMmdoenE4d20yN3VkL21JTTdBWTJxRU9SUjhHbzNUVkI0SHpXUWdwClpydDNpNU1JbENhWTUwNEx6U1JpaWdIQ3pBUGxId3MrVzByQjVOK2VyNS8ycEpLbmZCU0RpQ2lGQVZ0Q0xPWjdnTGlNbTBqaE8yQjYKdFVYSEkvK01SUGp5MDJpNTlsSU5NUlJldjU2R0t0Y2Q5cU8vMGtVSldkWlRkQTJYb1M4Mml4UHZadFhRcFVwdUwxMmFiKzlFYURLOApaNFJISllZZkNUM1E1dk5BWGFpV1ErOFBUV20yUWdCUi9ia3dTV2MrTnBVRmdOUE45UHZRaThXRWc1VW1BR01DQXdFQUFhT0JwakNCCm96QWRCZ05WSFE0RUZnUVVObUhoQUh5SUJRbFJpMFJzUi84YVRNbnFUeEl3SHdZRFZSMGpCQmd3Rm9BVU5tSGhBSHlJQlFsUmkwUnMKUi84YVRNbnFUeEl3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFPQmdOVkhROEJBZjhFQkFNQ0FZWXdRQVlEVlIwZkJEa3dOekExb0RPZwpNWVl2YUhSMGNITTZMeTloYm1SeWIybGtMbWR2YjJkc1pXRndhWE11WTI5dEwyRjBkR1Z6ZEdGMGFXOXVMMk55YkM4d0RRWUpLb1pJCmh2Y05BUUVMQlFBRGdnSUJBQ0RJdzQxTDNLbFhHMGFNaVMvL2NxckcrRVNoSFVHbzhITnN3MzBXMWtKdGpuNlVCd1JNNmpubWl3ZkIKUGI4VkE5MWNoYjJ2c3NBdFgyemJUdnFCSjkrTEJQR0Nkdy9FNTNSYmY4NnFoeEthaUFIT2pwdkF5NVkzbTAwbXFDMHcvWnd2anUxdAp3YjR2aExhSjVOa1VKWXNVUzdybUpLSEhCbkVUTGk4R0ZxaUVzcVRXcEcvNmliWUN2N3JZREJKRGNSOVc2MkJXOWpmSW9CUWN4VUNVCkpvdU1QSDI1bExOY0RjMXNzcXZDMnY3aVVnSTlMZW9NMXNOb3ZxUG1RVWlHOXJIbGkxdlh4ekN5YU1UandmdGtKTGtmNjcyNERGaHUKS3VnMmpJVFYwUWtYdmFKV0Y0blVhSE9UTkE0dUpVOVdEdlpMSTFqODNBKy94bkFKVXVjSXYvekdKMUFNSDJib0hxRjhDWTE2THBzWQpnQnQ2dEt4eFdIMDBYY3lEQ2RXMktsQkNlcWJRUGNzRm1XeVd1Z3hkY2VraFlzQVd5b1NmODE4TlVzWmRCV0JhUi9PdWtYck5MZmtRCjc5SXlab2haYnZhYk8vWCtNVlQzcnJpQW9LYzhvRTJVd3M2REYrNjBQVjcvV0lQak52WHlTZHFzcEltU043OG1mbHhEcXdMcVJCWWsKQTNJNzVxcHBMR0c5cnA3VUNkUmp4TWw4WkRCbGQrN3l2SFZndDFjVnpKeDl4bnlHQ0MyM1VhaWNNRFNYWXJCNEk0V0hYUEdqeGhadQpDdVBCTFRkT0xVOFlSdk1ZZEV2WWViV0hNcHZ3R0NGNmJBeDNKQnBJZU9RMXdEQjV5MFVTaWNWM1lnWUdtaStOWmZoQTRVUlNoNzdZCmQ2dXVKT0pFTlJhTlZUemsK';

const hardwareKey = {
  crv: 'P-256',
  kty: 'EC',
  x: 'Wj2elJow2OkGuqoQOhWLy66Ln8JGMuGfVTIg-9BuEjY',
  y: 'w7r89bjsU_sPDOBe0vqbNBKYW95hO9URpkaglSltpWc',
};

const ephemeralKey = {
  crv: 'P-256',
  kty: 'EC',
  x: '4HNptI-xr2pjyRJKGMnz4WmdnQD_uJSq4R95Nj98b44',
  y: 'LIZnSB39vFJhYgS3k7jXE4r3-CoGFQwZtPBIRqpNlrg',
  kid: 'vbeXJksM45xphtANnCiG6mCyuU4jfGNzopGuKvogg9c',
};

const integrityAssertion =
  'Cr0CARCnMGuc57T1faywYXiXp6Duu-F4ZFjB9xOehG0Bxowk74prPChIM-55FYD-dSOWWGgZNZsis0Nm5eHpLfnymXiuBrKXhrDJYX9vT4yu-v4si4lIzFMt4b-jwtmV164HiC-yYn66UBooy8HGv5bVut1Pb2NBZzJh_oCb7HPvywY8ahcQ8e0pajQjGosM-9MTa_yXaWycxppwVnxP6ONkgmaHltO5xWEJbDFwqJskpw8wvtm103BOCIB9f_Naa97ZECehKZrKxVVcW1kkRpk6ua5TaBPTJRxpryM3Sveaq3eWn8LECZez1ovQxUip3PQymDrQhYMekYhO8c77dlOiO49bf-CH9OHCYmnUB2YsjuP7--Na1rBqPHIl9O4unK5ytJJOVAuVwGjAbnWH7kV3QnbdVpUb6y5lxV9GcloaSQGnXnxlDg-DMH9tKlySbWl0jcOMCb6MPrDjPH0XwWrKN8rUSuliAVaojL-EUg2CQFLvw_vxDu0mZsvGQiTo1rygtHS7te-N9pM' as NonEmptyString;

const bundleIdentifier = 'com.ioreactnativeintegrityexample';

export const androidMockData = {
  keyId: 'anHardwareKeyTag',
  attestation,
  bundleIdentifier,
  challenge,
  ephemeralKey,
  hardwareKey,
  integrityAssertion,
};
