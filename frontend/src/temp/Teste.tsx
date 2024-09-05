import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  MultiStepForm,
  MultiStepFormHeader,
  MultiStepFormStep,
  createStepSchema,
  useMultiStepFormContext,
} from './MultStepForm'

import { toast } from 'react-toastify'
import ExpertRequestService from '@/services/expert-request.service'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useNavigate } from 'react-router-dom'

// Definindo o schema de validação com zod
const FormSchema = createStepSchema({
  intro: z.object({}),
  pessoal: z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    whatsapp: z.string(),
    instagram: z.string(),
  }),
  questionario: z.object({
    experienciaEdicao: z.enum(['SIM', 'NÃO']),
    experienciaMotionGraphics: z.enum(['SIM', 'NÃO']),
    computador: z.string(),
    programaEdicao: z.string(),
    trabalhosAnteriores: z.string(),
    habilidades: z.string(),
    portfolio: z.string().url(),
  }),
  disponibilidade: z.object({
    disponibilidadeImediata: z.enum(['SIM', 'NÃO']),
    pretensaoSalarial: z.coerce.number(),
    disponibilidadeTempo: z.string(),
  }),
})

export type FormValues = z.infer<typeof FormSchema>

// Componente principal MultiStepFormDemo
export function MultiStepFormDemo() {
  const navigate = useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      intro: {},
      pessoal: {
        nome: '',
        email: '',
        whatsapp: '',
        instagram: '',
      },
      questionario: {
        experienciaEdicao: 'NÃO',
        experienciaMotionGraphics: 'NÃO',
        computador: '',
        programaEdicao: '',
        trabalhosAnteriores: '',
        habilidades: '',
        portfolio: '',
      },
      disponibilidade: {
        disponibilidadeImediata: 'NÃO',
        pretensaoSalarial: 0,
        disponibilidadeTempo: '',
      },
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await ExpertRequestService.createVideoJob(data)
      if (response.data.success) {
        toast.success('Formulário enviado com sucesso')
        navigate('/obrigado')
      }
    } catch (error) {
      toast.error('Erro ao enviar formulário')
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-2/3 items-center justify-center p-2">
      <MultiStepForm
        className={'border-primary space-y-10 rounded-xl border p-8'}
        schema={FormSchema}
        form={form}
        onSubmit={onSubmit}
      >
        <MultiStepFormHeader
          className={'flex w-full flex-col justify-center space-y-6'}
        >
          <h2 className={'text-xl font-bold'}>Cadastro para Editor de Vídeo</h2>
        </MultiStepFormHeader>

        <MultiStepFormStep name="intro">
          <IntroStep />
        </MultiStepFormStep>

        <MultiStepFormStep name="pessoal">
          <PessoalStep />
        </MultiStepFormStep>

        <MultiStepFormStep name="questionario">
          <QuestionarioStep />
        </MultiStepFormStep>

        <MultiStepFormStep name="disponibilidade">
          <DisponibilidadeStep />
        </MultiStepFormStep>

        <MultiStepFormStep name="review">
          <ReviewStep />
        </MultiStepFormStep>
      </MultiStepForm>
    </div>
  )
}

function IntroStep() {
  const { nextStep } = useMultiStepFormContext()

  return (
    <div className={'flex flex-col gap-4'}>
      <p>
        Olá, antes de prosseguir para o questionário, precisamos deixar alguns
        pontos explícitos:
      </p>
      <ul className={'list-disc pl-6'}>
        <li>A vaga é para Editor de Vídeo.</li>
        <li>Modalidade: Remota.</li>
        <li>Regime: PJ.</li>
        <li>O preenchimento deste questionário não garante a vaga.</li>
      </ul>
      <Button onClick={nextStep}>Continuar para o questionário</Button>
    </div>
  )
}
function PessoalStep() {
  const { form, nextStep, isStepValid } = useMultiStepFormContext()
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
        <FormField
          name="pessoal.nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="pessoal.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="pessoal.whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="pessoal.instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button onClick={nextStep} disabled={!isStepValid()}>
            Próximo
          </Button>
        </div>
      </div>
    </Form>
  )
}

function QuestionarioStep() {
  const { form, nextStep, isStepValid, prevStep } = useMultiStepFormContext()
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
        <FormField
          name="questionario.experienciaEdicao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tem experiência com edição de vídeos?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="SIM" />
                    </FormControl>
                    <FormLabel className="font-normal">Sim</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="NAO" />
                    </FormControl>
                    <FormLabel className="font-normal">Não</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="questionario.experienciaMotionGraphics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tem experiência com Motion Graphics?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="SIM" />
                    </FormControl>
                    <FormLabel className="font-normal">Sim</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="NAO" />
                    </FormControl>
                    <FormLabel className="font-normal">Não</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="questionario.computador"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Qual computador você usa para editar atualmente?
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="questionario.programaEdicao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Qual programa de edição você está habituado a utilizar?
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="questionario.trabalhosAnteriores"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Com quem você já trabalhou como Editor de Vídeo?
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="questionario.habilidades"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Escreva abaixo as suas habilidades como Editor, o que você já
                editou, suas especialidades, etc...
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="questionario.portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Insira o link do seu portfólio, drive, com seus
                trabalhosAnteriores.
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type={'button'} variant={'outline'} onClick={prevStep}>
            Voltar
          </Button>
          <Button onClick={nextStep} disabled={!isStepValid()}>
            Próximo
          </Button>
        </div>
      </div>
    </Form>
  )
}

function DisponibilidadeStep() {
  const { form, nextStep, isStepValid, prevStep } = useMultiStepFormContext()
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
        <FormField
          name="disponibilidade.disponibilidadeImediata"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Você teria disponibilidade para começar imediatamente?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="SIM" />
                    </FormControl>
                    <FormLabel className="font-normal">Sim</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="NAO" />
                    </FormControl>
                    <FormLabel className="font-normal">Não</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="disponibilidade.pretensaoSalarial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual sua pretensão salarial?</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="disponibilidade.disponibilidadeTempo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual sua disponibilidade de tempo diária?</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type={'button'} variant={'outline'} onClick={prevStep}>
            Voltar
          </Button>
          <Button onClick={nextStep} disabled={!isStepValid()}>
            Próximo
          </Button>
        </div>
      </div>
    </Form>
  )
}

function ReviewStep() {
  const { prevStep, form } = useMultiStepFormContext<typeof FormSchema>()
  const values = form.getValues()

  return (
    <div className={'flex flex-col space-y-4'}>
      <div className="font-bold">
        Por favor, reveja suas respostas antes de enviar:
      </div>
      <div className={'flex flex-col space-y-4'}>
        <div>
          <span>Nome:</span> <span>{values.pessoal.nome}</span>
        </div>
        <div>
          <span>Email:</span> <span>{values.pessoal.email}</span>
        </div>
        <div>
          <span>WhatsApp:</span> <span>{values.pessoal.whatsapp}</span>
        </div>
        <div>
          <span>Instagram:</span> <span>{values.pessoal.instagram}</span>
        </div>
        <div>
          <span>Experiência com edição de vídeos:</span>{' '}
          <span>{values.questionario.experienciaEdicao}</span>
        </div>
        <div>
          <span>Experiência com Motion Graphics:</span>{' '}
          <span>{values.questionario.experienciaMotionGraphics}</span>
        </div>
        <div>
          <span>Computador usado para editar:</span>{' '}
          <span>{values.questionario.computador}</span>
        </div>
        <div>
          <span>Programa de edição utilizado:</span>{' '}
          <span>{values.questionario.programaEdicao}</span>
        </div>
        <div>
          <span>Com quem já trabalhou como Editor de Vídeo:</span>{' '}
          <span>{values.questionario.trabalhosAnteriores}</span>
        </div>
        <div>
          <span>Habilidades e especialidades:</span>{' '}
          <span>{values.questionario.habilidades}</span>
        </div>
        <div>
          <span>Portfólio:</span> <span>{values.questionario.portfolio}</span>
        </div>
        <div>
          <span>Disponibilidade imediata:</span>{' '}
          <span>{values.disponibilidade.disponibilidadeImediata}</span>
        </div>
        <div>
          <span>Pretensão salarial:</span>{' '}
          <span>{values.disponibilidade.pretensaoSalarial}</span>
        </div>
        <div>
          <span>Disponibilidade de tempo diária:</span>{' '}
          <span>{values.disponibilidade.disponibilidadeTempo}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type={'button'} variant={'outline'} onClick={prevStep}>
          Voltar
        </Button>

        <Button type={'submit'}>Enviar Respostas</Button>
      </div>
    </div>
  )
}
