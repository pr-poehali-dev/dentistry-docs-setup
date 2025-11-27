import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Document {
  id: string;
  type: string;
  patientName: string;
  date: string;
  status: 'draft' | 'completed' | 'archived';
  doctor: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      type: 'Медицинская карта',
      patientName: 'Иванов Иван Иванович',
      date: '2024-11-20',
      status: 'completed',
      doctor: 'Петров А.В.'
    },
    {
      id: '2',
      type: 'Согласие на лечение',
      patientName: 'Сидорова Мария Петровна',
      date: '2024-11-22',
      status: 'completed',
      doctor: 'Смирнова Е.И.'
    },
    {
      id: '3',
      type: 'План лечения',
      patientName: 'Козлов Петр Сергеевич',
      date: '2024-11-25',
      status: 'draft',
      doctor: 'Петров А.В.'
    },
    {
      id: '4',
      type: 'Медицинская карта',
      patientName: 'Николаева Анна Дмитриевна',
      date: '2024-11-26',
      status: 'completed',
      doctor: 'Смирнова Е.И.'
    }
  ]);

  const [newDocument, setNewDocument] = useState({
    type: '',
    patientName: '',
    doctor: '',
    notes: ''
  });

  const filteredDocuments = documents.filter(doc =>
    doc.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = {
    total: documents.length,
    completed: documents.filter(d => d.status === 'completed').length,
    draft: documents.filter(d => d.status === 'draft').length,
    archived: documents.filter(d => d.status === 'archived').length
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      completed: 'default',
      archived: 'outline'
    } as const;
    
    const labels = {
      draft: 'Черновик',
      completed: 'Завершен',
      archived: 'Архив'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleCreateDocument = () => {
    const doc: Document = {
      id: String(documents.length + 1),
      type: newDocument.type,
      patientName: newDocument.patientName,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      doctor: newDocument.doctor
    };
    setDocuments([doc, ...documents]);
    setNewDocument({ type: '', patientName: '', doctor: '', notes: '' });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={32} className="text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Медицинская документация</h1>
                <p className="text-sm text-muted-foreground">Стоматологическая клиника</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon name="Plus" size={18} />
                  Создать документ
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Новый документ</DialogTitle>
                  <DialogDescription>
                    Заполните информацию для создания медицинского документа
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Тип документа</Label>
                    <Select
                      value={newDocument.type}
                      onValueChange={(value) => setNewDocument({ ...newDocument, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Медицинская карта">Медицинская карта</SelectItem>
                        <SelectItem value="Согласие на лечение">Согласие на лечение</SelectItem>
                        <SelectItem value="План лечения">План лечения</SelectItem>
                        <SelectItem value="Направление">Направление</SelectItem>
                        <SelectItem value="Заключение">Заключение</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientName">ФИО пациента</Label>
                    <Input
                      id="patientName"
                      placeholder="Иванов Иван Иванович"
                      value={newDocument.patientName}
                      onChange={(e) => setNewDocument({ ...newDocument, patientName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Врач</Label>
                    <Input
                      id="doctor"
                      placeholder="Петров А.В."
                      value={newDocument.doctor}
                      onChange={(e) => setNewDocument({ ...newDocument, doctor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Примечания</Label>
                    <Textarea
                      id="notes"
                      placeholder="Дополнительная информация..."
                      value={newDocument.notes}
                      onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <DialogTrigger asChild>
                    <Button variant="outline">Отмена</Button>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <Button
                      onClick={handleCreateDocument}
                      disabled={!newDocument.type || !newDocument.patientName || !newDocument.doctor}
                    >
                      Создать
                    </Button>
                  </DialogTrigger>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего документов
              </CardTitle>
              <Icon name="FileText" size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{statusCounts.total}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Завершенные
              </CardTitle>
              <Icon name="CheckCircle2" size={20} className="text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{statusCounts.completed}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Черновики
              </CardTitle>
              <Icon name="Edit" size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{statusCounts.draft}</div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                В архиве
              </CardTitle>
              <Icon name="Archive" size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{statusCounts.archived}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Документы</CardTitle>
                <CardDescription>Управление медицинскими документами</CardDescription>
              </div>
              <div className="relative w-80">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по пациенту или типу..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground">{doc.patientName}</h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Stethoscope" size={14} />
                          {doc.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="User" size={14} />
                          {doc.doctor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          {new Date(doc.date).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Icon name="Eye" size={18} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="Edit" size={18} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="MoreVertical" size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
