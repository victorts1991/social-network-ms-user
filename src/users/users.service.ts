import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserEntity, Address } from './entities/user.entity'; // <--- IMPORTANTE: Importar Address também
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  private usersCollection: admin.firestore.CollectionReference;

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {
    this.usersCollection = this.firebaseAdmin.firestore().collection('users');
  
  }

  private mapDocumentToUserEntity(doc: admin.firestore.DocumentSnapshot): UserEntity {
    const data = doc.data();
    if (!data) {
      throw new NotFoundException('Document data is empty.');
    }
    const createdAt = data.createdAt ? data.createdAt : undefined;
    const updatedAt = data.updatedAt ? data.updatedAt : undefined; 


    // Mapeia o objeto de endereço
    const address: Address | undefined = data.address ? {
      cep: data.address.cep,
      street: data.address.street,
      number: data.address.number,
      city: data.address.city,
      state: data.address.state,
      complement: data.address.complement,
    } : undefined;


    return {
      id: doc.id,
      firebaseUid: data.firebaseUid,
      email: data.email,
      name: data.name,
      surname: data.surname,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined, // Assumindo que birthDate é string e precisa ser convertido
      isDocumentVerified: data.isDocumentVerified,
      address: address, // <--- NOVO: Mapeia o objeto de endereço
      createdAt,
      updatedAt,
    } as UserEntity; // Assegura o tipo de retorno
  }

  async findOneByFirebaseUid(firebaseUid: string): Promise<UserEntity | undefined> {
    const snapshot = await this.usersCollection.where('firebaseUid', '==', firebaseUid).limit(1).get();
    if (snapshot.empty) {
      return undefined;
    }
    return this.mapDocumentToUserEntity(snapshot.docs[0]);
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    

    const newUserDocument = {
      ...createUserDto,
      createdAt: new Date(), //admin.firestore.FieldValue.serverTimestamp(), 
      updatedAt: new Date(), //admin.firestore.FieldValue.serverTimestamp(), 
      isDocumentVerified: false, 
    };
    const docRef = await this.usersCollection.add(newUserDocument);
    
    return { id: docRef.id, ...newUserDocument } as UserEntity;
  }

  async update(firebaseUid: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const userQuery = await this.usersCollection.where('firebaseUid', '==', firebaseUid).limit(1).get();
    if (userQuery.empty) {
      throw new NotFoundException(`User with Firebase UID ${firebaseUid} not found.`);
    }
    const docSnapshot = userQuery.docs[0];
    const userId = docSnapshot.id;

    const plainUpdateData = instanceToPlain(updateUserDto);

    const updatedFields = {
      ...plainUpdateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await this.usersCollection.doc(userId).update(updatedFields);

    // Após a atualização, busque o documento novamente para ter os dados mais recentes e corretos.
    const updatedDocSnapshot = await this.usersCollection.doc(userId).get();
    return this.mapDocumentToUserEntity(updatedDocSnapshot);
  }

  async updateDocumentVerificationStatus(firebaseUid: string, status: boolean): Promise<UserEntity> {
    const userQuery = await this.usersCollection.where('firebaseUid', '==', firebaseUid).limit(1).get();
    if (userQuery.empty) {
      throw new NotFoundException(`User with Firebase UID ${firebaseUid} not found.`);
    }
    const docSnapshot = userQuery.docs[0];
    const userId = docSnapshot.id;

    await this.usersCollection.doc(userId).update({
      isDocumentVerified: status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updatedDocSnapshot = await this.usersCollection.doc(userId).get();
    return this.mapDocumentToUserEntity(updatedDocSnapshot);
  }
}