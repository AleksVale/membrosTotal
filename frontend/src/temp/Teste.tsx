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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'react-toastify'
import ExpertRequestService from '@/services/expert-request.service'

// Definindo o schema de validação com zod
const FormSchema = createStepSchema({
  intro: z.object({}),
  questionario: z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    whatsapp: z.string(),
    instagram: z.string(),
    experienciaEdicao: z.enum(['SIM', 'NÃO']),
    experienciaMotionGraphics: z.enum(['SIM', 'NÃO']),
    computador: z.string(),
    programaEdicao: z.string(),
    trabalhosAnteriores: z.string(),
    habilidades: z.string(),
    portfolio: z.string().url(),
    disponibilidadeImediata: z.enum(['SIM', 'NÃO']),
    pretensaoSalarial: z.coerce.number(),
    disponibilidadeTempo: z.string(),
  }),
})

export type FormValues = z.infer<typeof FormSchema>

// Componente principal MultiStepFormDemo
export function MultiStepFormDemo() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      intro: {},
      questionario: {
        nome: '',
        email: '',
        whatsapp: '',
        instagram: '',
        experienciaEdicao: 'NÃO',
        experienciaMotionGraphics: 'NÃO',
        computador: '',
        programaEdicao: '',
        trabalhosAnteriores: '',
        habilidades: '',
        portfolio: '',
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
      }
    } catch (error) {
      toast.error('Erro ao enviar formulário')
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-2">
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

        <MultiStepFormStep name="questionario">
          <QuestionarioStep />
        </MultiStepFormStep>

        <MultiStepFormStep name="review">
          <ReviewStep />
        </MultiStepFormStep>
      </MultiStepForm>
    </div>
  )
}

// Etapa de introdução
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

// Etapa do questionário
function QuestionarioStep() {
  const { form, nextStep, isStepValid } = useMultiStepFormContext()
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
        <FormField
          name="questionario.nome"
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
          name="questionario.email"
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
          name="questionario.whatsapp"
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
          name="questionario.instagram"
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

        <FormField
          name="questionario.experienciaEdicao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tem experiência com edição de vídeos?</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIM">SIM</SelectItem>
                    <SelectItem value="NÃO">NÃO</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIM">SIM</SelectItem>
                    <SelectItem value="NÃO">NÃO</SelectItem>
                  </SelectContent>
                </Select>
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

        <FormField
          name="questionario.disponibilidadeImediata"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Você teria disponibilidade para começar imediatamente?
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIM">SIM</SelectItem>
                    <SelectItem value="NÃO">NÃO</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="questionario.pretensaoSalarial"
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
          name="questionario.disponibilidadeTempo"
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

        <div className="flex justify-end">
          <Button onClick={nextStep} disabled={!isStepValid()}>
            Próximo
          </Button>
        </div>
      </div>
    </Form>
  )
}

// Etapa de revisão
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
          <span>Nome:</span> <span>{values.questionario.nome}</span>
        </div>
        <div>
          <span>Email:</span> <span>{values.questionario.email}</span>
        </div>
        <div>
          <span>WhatsApp:</span> <span>{values.questionario.whatsapp}</span>
        </div>
        <div>
          <span>Instagram:</span> <span>{values.questionario.instagram}</span>
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
          <span>{values.questionario.disponibilidadeImediata}</span>
        </div>
        <div>
          <span>Pretensão salarial:</span>{' '}
          <span>{values.questionario.pretensaoSalarial}</span>
        </div>
        <div>
          <span>Disponibilidade de tempo diária:</span>{' '}
          <span>{values.questionario.disponibilidadeTempo}</span>
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
